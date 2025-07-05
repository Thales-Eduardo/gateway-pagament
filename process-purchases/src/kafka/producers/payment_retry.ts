import { InterfacePaymentRequestDtos } from "../../interfaces/paymentRequest.dtos";
import { producerPaymentRetry as producer } from "./index";

interface InterfacePaymentRetry {
  originalTopic: string;
  originalMessage: InterfacePaymentRequestDtos;
  error: {
    name: any;
    message: any;
    stack: any;
    code: any;
  };
  timestamp: Date | string;
}

export async function producerPaymentRetry(data: InterfacePaymentRetry) {
  await producer.connect(); //desabilitar para testar

  try {
    const metadata = await producer.send({
      topic: "payment_retry",
      messages: [
        {
          key: data.originalMessage.produto.user_id,
          value: JSON.stringify(data),
          headers: {
            origin: "my-producer-payment_retry",
            retry_count: "0",
          },
        },
      ],
    });

    return metadata;
  } catch (error) {
    console.error("⚠️ Erro ao enviar mensagem para payment_retry:", error);
  }
}

// (async () => {
//   producerPaymentRetry({
//     produto: {
//       product_id: "01JZ5VX50DYEGCF55ZZ9KZ9SQA",
//       user_id: "86464d8f-f500-4226-990b-0ce83bf7e829",
//       price: 12,
//       quantity: 1,
//       total_price: 12,
//     },

//     card: {
//       card_number: "4111111111111111",
//       card_exp_month: "03",
//       card_exp_year: "2026",
//       card_security_code: "123",
//     },

//     data: new Date(),
//   });
// })();
