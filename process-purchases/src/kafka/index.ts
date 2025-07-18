import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "process-purchases",
  brokers: ["localhost:9094"],
  ssl: false,
  retry: {
    initialRetryTime: 300, // tempo inicial para retry (ms)
    retries: 10, // número máximo de tentativas
  },
});

// criar topics
(async () => {
  const admin = kafka.admin();
  await admin.connect();

  const topics = [
    {
      topic: "order_queue",
      numPartitions: 1, // número de partições 1 = fifo/ordem global
      replicationFactor: 1, // fator de replicação
    },
    {
      topic: "process-purchases", // processar compras
      numPartitions: 2,
      replicationFactor: 1,
    },
    {
      topic: "purchases-processed", // compras processadas
      numPartitions: 2,
      replicationFactor: 1,
    },
    {
      topic: "payment_retry", // erro no processamento de pagamentos
      numPartitions: 2,
      replicationFactor: 1,
      config: {
        "message.timestamp.type": "LogAppendTime",
      },
    },
    {
      topic: "payment_dlq", // para erros definitivos no processamento de pagamentos
      numPartitions: 2,
      replicationFactor: 1,
      config: {
        "retention.ms": "-1", // Retenção infinita
      },
    },
  ];

  await admin.createTopics({ topics });

  await admin.disconnect();
  console.log("Topics created successfully");
})();
