const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

export const producer = new Kafka().producer({
  kafkaJS: {
    brokers: ["localhost:9094"],
    ssl: false,
    acks: -1,
    // retry: { retries: 10 },
    transactionTimeout: 60000,
  },
});

export const producerPaymentRetry = new Kafka().producer({
  kafkaJS: {
    brokers: ["localhost:9094"],
    ssl: false,
    acks: -1,
    // retry: { retries: 10 },
    transactionTimeout: 60000,
  },
});

export async function connectAllProducers() {
  try {
    await Promise.all([producer.connect(), producerPaymentRetry.connect()]);
    console.log("✅ Todos os producers conectados");
  } catch (error) {
    console.error("⚠️ Erro ao conectar producers:", error);
    throw error;
  }
}

export async function disconnectAllProducers() {
  try {
    await Promise.all([
      producer.disconnect(),
      producerPaymentRetry.disconnect(),
    ]);
    console.log("⏳ Producers desconectados");
  } catch (error) {
    console.error("⚠️ Erro ao desconectar producers:", error);
  }
}
