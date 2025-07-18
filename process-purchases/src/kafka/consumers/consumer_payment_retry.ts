import { EachMessagePayload } from "kafkajs";
import { PaymentRepository } from "../../repository/PaymentRepository";
import { RetryPagamentService } from "../../services/retryPagamentService";
import { producerPaymentDLQ } from "../producers/producer-dlq";
import { consumerPaymentRetry } from "./index";

const retryService = new RetryPagamentService(new PaymentRepository());

const MAX_RETRY_COUNT = 5; // Define o número máximo de tentativas

export async function consumerPaymentRetryQueue() {
  try {
    await consumerPaymentRetry.connect();
    await consumerPaymentRetry.subscribe({
      topic: "payment_retry",
    });

    await consumerPaymentRetry.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
      }: EachMessagePayload) => {
        try {
          await heartbeat();
          const data = JSON.parse(message.value!.toString());

          const result = await retryService.checkCount(
            data.originalMessage.anti_duplication.id
          );
          console.log("result:", result);

          if (!result) {
            await consumerPaymentRetry.commitOffsets([
              { topic, partition, offset: message.offset },
            ]);
            await producerPaymentDLQ(data);
            return;
          }
          if (result >= MAX_RETRY_COUNT) {
            await consumerPaymentRetry.commitOffsets([
              { topic, partition, offset: message.offset },
            ]);
            await producerPaymentDLQ(data);
            return;
          }

          await heartbeat();

          await consumerPaymentRetry.commitOffsets([
            { topic, partition, offset: message.offset },
          ]);

          await consumerPaymentRetryQueueData(data);
        } catch (error: any) {
          await heartbeat();
          console.error(
            `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
            error
          );
          await producerPaymentDLQ({
            originalTopic: "payment_retry",
            originalMessage: JSON.parse(message.value!.toString()),
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
    setTimeout(consumerPaymentRetryQueue, 10000);
  }
}

async function consumerPaymentRetryQueueData(data: any) {
  console.log("data", new Date().toLocaleTimeString());
  await retryService.execute(data);

  return data;
}
