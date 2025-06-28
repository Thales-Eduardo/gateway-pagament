import { EachMessagePayload } from "kafkajs";
import { producerDlq } from "../producers/index";
import { consumerPurchases } from "./index";

export async function consumerPurchasesProcessed() {
  try {
    await consumerPurchases.connect();
    await consumerPurchases.subscribe({
      topic: "purchases-processed",
    });

    await consumerPurchases.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
      }: EachMessagePayload) => {
        try {
          await heartbeat();

          const data = JSON.parse(message.value!.toString());
          await consumerPurchasesProcessedData(data);

          await heartbeat();

          await consumerPurchases.commitOffsets([
            { topic, partition, offset: message.offset },
          ]);
        } catch (error: any) {
          await heartbeat();
          console.error(
            `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
            error
          );
          await sendToDLQ({
            originalTopic: "purchases-processed",
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
      },

      // eachBatch: async ({ batch, resolveOffset, heartbeat }: any) => {
      //   // Processamento em lote (mais eficiente)
      // },
    });
  } catch (error) {
    console.error("Erro fatal, reiniciando em 10s...", error);
    setTimeout(consumerPurchasesProcessed, 10000);
  }
}

async function consumerPurchasesProcessedData(data: any) {
  //operação de regra de negocio com o banco de dados
  console.log("consumer = purchases-processed:", data);

  return data;
}

async function sendToDLQ(dlqPayload: any) {
  try {
    await producerDlq.send({
      topic: "order_queue_consumer_dlq",
      messages: [
        {
          value: JSON.stringify(dlqPayload),
        },
      ],
    });
    console.log("Mensagem enviada para DLQ");
  } catch (dlqError: any) {
    console.error("FALHA CRÍTICA: Erro ao enviar para DLQ", dlqError);
  }
}
