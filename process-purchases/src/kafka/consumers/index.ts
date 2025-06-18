const { kafka } = require("@confluentinc/kafka-javascript").KafkaJS;

export const consumer = new kafka().consumer({
  brokers: ["localhost:9094"],
  sessionTimeout: 30000,
  heartbeatInterval: 10000,
  maxBytesPerPartition: 1048576, // 1MB
  maxBytes: 10485760, // 10MB
  maxWaitTimeInMs: 5000,
  autoCommit: false,
  allowAutoTopicCreation: false,
  readUncommitted: false,
  retry: {
    maxRetryTime: 30000,
    initialRetryTime: 300,
    factor: 0.2,
    multiplier: 2,
  },
});
