import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order_queue_connect",
  brokers: ["host.docker.internal:9094"],
  ssl: false,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

export const consumer = kafka.consumer({
  groupId: "my-consumer-group",
  sessionTimeout: 30000,
  allowAutoTopicCreation: false,
  heartbeatInterval: 10000,
  maxBytesPerPartition: 1048576, // 1MB
  maxBytes: 10485760, // 10MB
  maxWaitTimeInMs: 5000,
  readUncommitted: false,
  retry: {
    maxRetryTime: 30000,
    initialRetryTime: 300,
    factor: 0.2,
    multiplier: 2,
  },
});

// export const consumer = kafka().consumer({
//   kafkaJS: {
//      brokers: ["localhost:9094"],
//   clientId: "consumer-process",
//   connectionTimeout: 10000,
//   requestTimeout: 30000,
//   retry: {
//     maxRetryTime: 30000,
//     initialRetryTime: 300,
//     factor: 0.2,
//     multiplier: 2,
//   },
//     sessionTimeout: 30000,
//     heartbeatInterval: 10000,
//     maxBytesPerPartition: 1048576, // 1MB
//     maxBytes: 10485760, // 10MB
//     maxWaitTimeInMs: 5000,
//     autoCommit: false,
//     allowAutoTopicCreation: false,
//     readUncommitted: false,
//   },
// });
