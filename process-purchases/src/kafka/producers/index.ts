const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

export const producer = new Kafka().producer({
  kafkaJS: {
    brokers: ["localhost:9094"],
    ssl: false,
    acks: -1,
    retry: { retries: 10 },
    compression: "snappy", // Snappy
    transactionTimeout: 60000,
  },
});
