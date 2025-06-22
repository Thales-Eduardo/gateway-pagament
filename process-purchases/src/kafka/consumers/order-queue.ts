import { EachMessagePayload } from "kafkajs";
import { producer } from "../producers/index";
import { consumer } from "./index";

export async function consumerOrderQueue() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "order_queue", fromBeginning: true });

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        try {
          const data = JSON.parse(message.value!.toString());
          await consumerOrderQueueData(data);

          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);
        } catch (error: any) {
          console.error(
            `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
            error
          );
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
      },

      // eachBatch: async ({ batch, resolveOffset, heartbeat }: any) => {
      //   // Processamento em lote (mais eficiente)
      // },
    });

    // Mantém o consumer ativo até erro fatal
    await new Promise(() => {}); // Mantém o processo aberto
  } catch (error) {
    console.error("Erro fatal, reiniciando em 10s...", error);
    setTimeout(consumerOrderQueue, 10000);
  }
}

async function consumerOrderQueueData(data: any) {
  //operação com o banco de dados
  console.log("consumer:", data);

  return data;
}

async function sendToDLQ(dlqPayload: any) {
  try {
    await producer.send({
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
