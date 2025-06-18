import { EachMessagePayload } from "@confluentinc/kafka-javascript/types/kafkajs";
import { consumer } from "./index";

export async function consumerOrderQueue() {
  await consumer.connect();

  await consumer.subscribe({
    topics: "order_queue",
    groupId: "my-consumer-group",
    fromBeginning: false, // Começa do offset mais recente
  });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      try {
        // Processamento seguro
        const data = JSON.parse(message.value!.toString());
        await consumerOrderQueueData(data);

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);
      } catch (error) {
        console.error(
          `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
          error
        );
        await sendToDLQ(message, error);
      }
    },

    // eachBatch: async ({ batch, resolveOffset, heartbeat }: any) => {
    //   // Processamento em lote (mais eficiente)
    // },
  });
}

async function consumerOrderQueueData(data: any) {
  return data;
}

async function sendToDLQ(message: any, error: any) {}

// const processingQueue = [];
// const MAX_PARALLEL = 5;

// while (true) {
//   const messages = await consumer.consume({ timeout: 1000 });

//   for (const message of messages) {
//     if (processingQueue.length >= MAX_PARALLEL) {
//       await Promise.race(processingQueue);
//     }

//     const processing = processMessage(message).finally(() => {
//       processingQueue.splice(processingQueue.indexOf(processing), 1);
//     });

//     processingQueue.push(processing);
//   }
// }

// Tratamento de erros com DLQ específica por tópico
// async function handleMessageError(topic, message, error) {
//   const dlqTopic = `${topic}-dlq`;

//   // Enviar para DLQ específica do tópico
//   const producer = consumer.producer();
//   await producer.connect();

//   await producer.send({
//     topic: dlqTopic,
//     messages: [{
//       value: message.value,
//       headers: {
//         originalTopic: topic,
//         error: error.message,
//         offset: message.offset,
//         partition: message.partition.toString()
//       }
//     }]
//   });

//   await producer.disconnect();
// }

// // Desligamento gracioso
// export async function stopConsumer() {
//   await consumer.disconnect();
//   console.log('Consumer desconectado');
// }
