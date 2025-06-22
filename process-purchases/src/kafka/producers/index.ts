const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

export const producer = new Kafka().producer({
  kafkaJS: {
    brokers: ["localhost:9094"],
    ssl: false,
    acks: -1,
    enableIdempotence: true,
    retry: { retries: 10 },
    compression: 2, // Snappy
    transactionTimeout: 60000,
  },
});
