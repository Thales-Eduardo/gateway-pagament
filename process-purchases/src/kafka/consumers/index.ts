// import { Kafka } from "kafkajs";

// const kafka = new Kafka({
//   clientId: "order_queue_connect",
//   brokers: ["host.docker.internal:9094"],
//   ssl: false,
//   retry: {
//     initialRetryTime: 300,
//     retries: 10,
//   },
// });

// export const consumer = kafka.consumer({
//   groupId: "my-consumer-group",
//   sessionTimeout: 30000,
//   allowAutoTopicCreation: false,
//   heartbeatInterval: 10000,
//   maxBytesPerPartition: 1048576, // 1MB
//   maxBytes: 10485760, // 10MB
//   maxWaitTimeInMs: 5000,
//   readUncommitted: false,
//   retry: {
//     maxRetryTime: 30000,
//     initialRetryTime: 300,
//     factor: 0.2,
//     multiplier: 2,
//   },
// });

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

// export const consumer2 = new Kafka().consumer({
//   kafkaJS: {
//     brokers: ["localhost:9094"],
//     clientId: "consumer-process",
//   },
// });
