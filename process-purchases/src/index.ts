import cors from "cors";
import "dotenv";
import express, { ErrorRequestHandler } from "express";
import { AppErrors } from "./error/errors";
import "./kafka";
import { consumerPaymentRetryQueue } from "./kafka/consumers/consumer_payment_retry";
import { consumerOrderQueue } from "./kafka/consumers/order-queue";
import { consumerUserPurchasesProcessed } from "./kafka/consumers/process-purchased";
import { connectAllProducers, disconnectAllProducers } from "./kafka/producers";
import { router } from "./router";

const app = express();
const port = 3334;

app.use(express.json());
app.use(cors());
app.use(router);

app.get("/", (req: any, res: any) => {
  return res.json({
    status: "ok",
    message: "Process Purchases Service is running",
  });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  if (err instanceof AppErrors) {
    return res.json({
      status: err.statusCode || "error",
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
app.use(errorHandler);

//consumer
(async () => {
  await Promise.all([
    consumerOrderQueue(),
    consumerUserPurchasesProcessed(),
    consumerPaymentRetryQueue(),
    connectAllProducers(),
  ]);
})();

const server = app.listen(port, () => {
  console.log(`http://localhost:${port} 🔥🔥🚒`);
});

// ---- Graceful Shutdown
function gracefulShutdown(event: any) {
  const data = new Date().toLocaleString();
  return async (code: any) => {
    await disconnectAllProducers();
    console.log(`${event} - server ending ${code}`, data);
    server.close(async () => {
      process.exit(0);
    });
  };
}

//disparado no ctrl+c => multiplataforma
process.on("SIGINT", gracefulShutdown("SIGINT"));
//Para aguardar as conexões serem encerradas para só então encerrar a aplicação.
process.on("SIGTERM", gracefulShutdown("SIGTERM"));

// captura erros não tratados
process.on("uncaughtException", (error, origin) => {
  console.log(`${origin} uncaughtException -  signal received ${error}`);
});
process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection - signal received ${error}`);
});

process.on("exit", (code) => {
  console.log(`exit signal received ${code}`);
});

// // simular um erro
// setTimeout(() => {
//   process.exit(1);
// }, Math.random() * 1e4); // 10.000

export { app, server };
