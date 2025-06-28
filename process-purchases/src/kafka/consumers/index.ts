const { Kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

export const consumerOrder = new Kafka().consumer({
  kafkaJS: {
    brokers: ["localhost:9094"],
    clientId: "oder-queue-consumer",
    groupId: "order_queue_consumer_group",
    fromBeginning: true,
    autoCommit: false,
    sessionTimeout: 45000,
    heartbeatInterval: 15000,
  },
});

export const consumerPurchases = new Kafka().consumer({
  kafkaJS: {
    brokers: ["localhost:9094"],
    clientId: "purchases_processed_consumer",
    groupId: "purchases_processed_consumer_group",
    fromBeginning: true,
    autoCommit: false,
    sessionTimeout: 45000,
    heartbeatInterval: 15000,
  },
});
