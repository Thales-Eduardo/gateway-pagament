import { InterfacePaymentRequestDtos } from "../../interfaces/paymentRequest.dtos";
import { producerOrderQueue as producer } from "./index";
import { producerPaymentRetry } from "./payment_retry";

export async function producerOrderQueue({
  message,
  count = 0,
}: {
  message: InterfacePaymentRequestDtos;
  count?: number;
}) {
  try {
    // await producer.connect(); //desabilitar para testar
    const metadata = await producer.send({
      topic: "order_queue",
      messages: [
        {
          key: message.produto.user_id,
          value: JSON.stringify(message),
          headers: {
            origin: "my-producer-order_queue",
            attempt: count.toString() || "0",
          },
        },
      ],
    });

    return metadata;
  } catch (error: any) {
    console.log("erro", error);
    await producerPaymentRetry({
      originalTopic: "order_queue",
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
//   await producerOrderQueue({
//     produto: {
//       product_id: "123",
//       user_id: "1234",
//       price: 12,
//       quantity: 1,
//       total_price: 12,
//     },

//     card: {
//       card_number: "214143",
//       card_exp_month: "tedaawdast",
//       card_exp_year: "dsaedad",
//       card_security_code: "123",
//     },

//     data: new Date(),

//     anti_duplication: {
//       id: "anti_duplication_id",
//       user_id: "1234",
//       processed: false,
//     },
//   });
// })();
