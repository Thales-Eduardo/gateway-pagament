import { InterfacePaymentRequestDtos } from "../../interfaces/paymentRequest.dtos";
import { producerProcessPurchess as producer } from "./index";
import { producerPaymentRetry } from "./payment_retry";

export async function producerProcessPurchess(
  message: InterfacePaymentRequestDtos
) {
  try {
    // await producer.connect(); //desabilitar para testar

    const metadata = await producer.send({
      topic: "process-purchases",
      messages: [
        {
          key: message.produto.user_id,
          value: JSON.stringify(message),
          headers: {
            origin: "my-producer-process-purchases",
            attempt: "0",
          },
        },
      ],
    });

    return metadata;
  } catch (error: any) {
    await producerPaymentRetry({
      originalTopic: "process-purchases",
      originalMessage: message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

// (async () => {
//   producerProcessPurchess({
//     produto: {
//       product_id: "123",
//       user_id: "1234",
//       price: 12,
//       quantity: 1,
//       total_price: 12,
//     },

//     card: {
//       card_number: "214143",
//       card_exp_month: "fsfsfs",
//       card_exp_year: "dsaedad",
//       card_security_code: "123",
//     },

//     data: new Date(),
//   });
// })();
