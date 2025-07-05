import { EachMessagePayload } from "kafkajs";
import { PaymentRepository } from "../../repository/PaymentRepository";
import { ProcessPaymentRequest } from "../../services/ProcessPaymentRequest";
import { producerPaymentRetry } from "../producers/payment_retry";
import { consumerOrder } from "./index";

const paymentRepository = new PaymentRepository();
const processPaymentRequest = new ProcessPaymentRequest(paymentRepository);

export async function consumerOrderQueue() {
  try {
    await consumerOrder.connect();
    await consumerOrder.subscribe({
      topic: "order_queue",
    });

    await consumerOrder.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
      }: EachMessagePayload) => {
        try {
          await heartbeat();

          const data = JSON.parse(message.value!.toString());
          await consumerOrderQueueData(data);

          await heartbeat();

          await consumerOrder.commitOffsets([
            { topic, partition, offset: message.offset },
          ]);
        } catch (error: any) {
          await heartbeat();
          console.error(
            `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
            error
          );
          await producerPaymentRetry({
            originalTopic: "order_queue",
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
    setTimeout(consumerOrderQueue, 10000);
  }
}

async function consumerOrderQueueData(data: any) {
  await processPaymentRequest.execute(data);
  console.log("consumer = order_queue:", data);

  return data;
}
