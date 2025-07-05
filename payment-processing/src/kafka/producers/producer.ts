import { InterfacePaymentRequestDtos } from "../../service/make_payment";
import { producer } from "./producer_start";

export async function producerProcessPurchess(
  message: InterfacePaymentRequestDtos
) {
  try {
    // await producer.connect(); //desabilitar para testar

    const metadata = await producer.send({
      topic: "purchases-processed",
      messages: [
        {
          key: message.produto.user_id,
          value: JSON.stringify(message),
          headers: {
            origin: "my-producer-purchases-processed",
            attempt: "0",
          },
        },
      ],
    });

    return metadata;
  } catch (error: any) {
    // await sendToDLQ({
    //   originalTopic: "purchases-processed",
    //   originalMessage: message,
    //   error: {
    //     name: error.name,
    //     message: error.message,
    //     stack: error.stack,
    //     code: error.code,
    //   },
    //   timestamp: new Date().toISOString(),
    // });
    console.error(
      "FALHA CRÍTICA: Erro ao enviar mensagem para o tópico purchases-processed",
      error
    );
  }
}

// async function sendToDLQ(dlqPayload: any) {
//   try {
//     await producerDlq.send({
//       topic: "order_queue_dlq",
//       messages: [
//         {
//           value: JSON.stringify(dlqPayload),
//         },
//       ],
//     });
//     console.log("Mensagem enviada para DLQ");
//   } catch (dlqError: any) {
//     console.error("FALHA CRÍTICA: Erro ao enviar para DLQ", dlqError);
//   }
// }

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
