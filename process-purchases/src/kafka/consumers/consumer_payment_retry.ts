import { EachMessagePayload } from "kafkajs";
import { consumerPaymentRetry } from "./index";

const MAX_RETRY_COUNT = 5; // Define o número máximo de tentativas

export async function consumerPaymentRetryQueue() {
  try {
    await consumerPaymentRetry.connect();
    await consumerPaymentRetry.subscribe({
      topic: "payment_retry",
    });

    console.log("messages:");
    await consumerPaymentRetry.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
      }: EachMessagePayload) => {
        try {
          await heartbeat();

          const headers = message.headers;
          const retryCountStr = headers?.retry_count?.toString() ?? "0";
          const count = parseInt(retryCountStr, 10);
          const nextRetry = count + 1;

          if (nextRetry >= MAX_RETRY_COUNT) {
            await consumerPaymentRetry.commitOffsets([
              { topic, partition, offset: message.offset },
            ]);
            // adicionar dlq
            console.log("adicionar dlq");
            return;
          }

          const data = JSON.parse(message.value!.toString());
          await consumerPaymentRetryQueueData(data, nextRetry);

          await heartbeat();

          await consumerPaymentRetry.commitOffsets([
            { topic, partition, offset: message.offset },
          ]);
          console.log(
            "nextRetry:",
            nextRetry,
            "data",
            new Date().toLocaleTimeString(),
            "message:",
            data
          );
          // await producerOrderQueue({ message: data, count: nextRetry });
        } catch (error: any) {
          await heartbeat();
          console.error(
            `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
            error
          );
          //enviar para dlq
          //   await producerPaymentRetry({
          //     originalTopic: "order_queue",
          //     originalMessage: JSON.parse(message.value!.toString()),
          //     error: {
          //       name: error.name,
          //       message: error.message,
          //       stack: error.stack,
          //       code: error.code,
          //     },
          //     timestamp: new Date().toISOString(),
          //   });
        }
      },

      // eachBatch: async ({ batch, resolveOffset, heartbeat }: any) => {
      //   // Processamento em lote (mais eficiente)
      // },
    });
  } catch (error) {
    console.error("Erro fatal, reiniciando em 10s...", error);
    // setTimeout(consumerPaymentRetryQueue, 10000);
  }
}

async function consumerPaymentRetryQueueData(data: any, nextRetry: number) {
  // enviar para o topic de payment_retry
  // console.log("consumer = payment_retry:", data, "nextRetry:", nextRetry);

  // await producerPaymentRetry({
  //   originalTopic: "payment_retry",
  //   originalMessage: data,
  //   error: {
  //     name: "MaxRetriesExceeded",
  //     message: "Maximum retry attempts exceeded",
  //     stack: new Error().stack,
  //     code: "MAX_RETRIES_EXCEEDED",
  //   },
  //   timestamp: new Date().toISOString(),
  // });
  return data;
}

(async () => {
  await consumerPaymentRetryQueue();
})();
