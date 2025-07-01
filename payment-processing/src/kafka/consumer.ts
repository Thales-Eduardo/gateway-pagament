import { EachMessagePayload } from "kafkajs";
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
          await sendToDLQ({
            originalTopic: "process-purchases",
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
    });
  } catch (error) {
    console.error("Erro fatal, reiniciando em 10s...", error);
    setTimeout(consumerProcessPaymentRequest, 10000);
  }
}

async function consumerProcessPaymentRequestData(data: any) {
  console.log("consumer = process-purchases:", data);
  // realizar pagamento, se der erro adicionar na DLQ
  return data;
}

async function sendToDLQ(dlqPayload: any) {
  try {
    // await producerDlq.send({
    //   topic: "order_queue_consumer_dlq",
    //   messages: [
    //     {
    //       value: JSON.stringify(dlqPayload),
    //     },
    //   ],
    // });
    console.log("Mensagem enviada para DLQ");
  } catch (dlqError: any) {
    console.error("FALHA CRÍTICA: Erro ao enviar para DLQ", dlqError);
  }
}
