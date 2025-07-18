import { EachMessagePayload } from "kafkajs";
import { InterfacePaymentRequestDtos } from "../../service/make_payment";
import { processPaymentService } from "../../service/processPayment.service";
import { producerPaymentRetry } from "../producers/producer_payment_retry";
const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

export const consumer = new Kafka().consumer({
  kafkaJS: {
    brokers: ["localhost:9094"],
    clientId: "purchases_processes_consumer",
    groupId: "purchases_processes_consumer_group",
    fromBeginning: true,
    autoCommit: false,
    sessionTimeout: 45000,
    heartbeatInterval: 15000,
  },
});

export async function consumerProcessPaymentRequest() {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "process-purchases",
    });

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
      }: EachMessagePayload) => {
        try {
          await heartbeat();

          const data = JSON.parse(message.value!.toString());
          await consumerProcessPaymentRequestData(data);

          await heartbeat();

          await consumer.commitOffsets([
            { topic, partition, offset: message.offset },
          ]);
        } catch (error: any) {
          await heartbeat();
          console.error(
            `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
            error
          );
          await producerPaymentRetry({
            originalTopic: "process-purchases",
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
    });
  } catch (error: any) {
    console.error("Erro fatal, reiniciando em 10s...", error);
    setTimeout(consumerProcessPaymentRequest, 10000);
  }
}

async function consumerProcessPaymentRequestData(
  data: InterfacePaymentRequestDtos
) {
  console.log("consumer = process-purchases:", data);

  await processPaymentService(data);

  return data;
}
