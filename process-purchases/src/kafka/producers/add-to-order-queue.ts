import { InterfacePaymentRequestDtos } from "../../interfaces/paymentRequest.dtos";
import { producer } from "./index";

export async function producerOrderQueue(message: InterfacePaymentRequestDtos) {
  try {
    await producer.connect();

    const metadata = await producer.send({
      topic: "order_queue",
      messages: [
        {
          key: message.produto.user_id,
          value: JSON.stringify(message),
          headers: {
            origin: "my-producer-order_queue",
            attempt: "0",
          },
        },
      ],
    });

    await producer.disconnect();

    return metadata;
  } catch (error: any) {
    console.log("erro", error);
    await sendToDLQ({
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

async function sendToDLQ(dlqPayload: any) {
  try {
    await producer.send({
      topic: "order_queue_dlq",
      messages: [
        {
          value: JSON.stringify(dlqPayload),
        },
      ],
    });
    console.log("Mensagem enviada para DLQ");

    await producer.disconnect();
  } catch (dlqError: any) {
    console.error("FALHA CRÍTICA: Erro ao enviar para DLQ", dlqError);
  }
}

// (async () => {
//   await producerOrderQueue({
//     produto: {
//       product_id: "123",
//       user_id: "1234",
//       price: 12,
//       quantity: 1,
//     },

//     card: {
//       card_number: "214143",
//       card_exp_month: "tedaawdast",
//       card_exp_year: "dsaedad",
//       card_security_code: "123",
//     },

//     data: new Date(),
//   });
// })();
