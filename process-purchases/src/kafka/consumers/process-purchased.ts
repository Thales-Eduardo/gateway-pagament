import { EachMessagePayload } from "kafkajs";
import { InterfacePaymentRequestDtos } from "../../interfaces/paymentRequest.dtos";
import {
  PaymentRepository,
  StatusPayment,
} from "../../repository/PaymentRepository";
import { producerDlq } from "../producers/index";
import { consumerPurchasesProcessed } from "./index";

const paymentRepository = new PaymentRepository();

export async function consumerUserPurchasesProcessed() {
  try {
    await consumerPurchasesProcessed.connect();
    await consumerPurchasesProcessed.subscribe({
      topic: "purchases-processed",
    });

    await consumerPurchasesProcessed.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
      }: EachMessagePayload) => {
        try {
          await heartbeat();

          const data = JSON.parse(message.value!.toString());
          await consumerUserPurchasesProcessedData(data);

          await heartbeat();

          await consumerPurchasesProcessed.commitOffsets([
            { topic, partition, offset: message.offset },
          ]);
        } catch (error: any) {
          await heartbeat();
          console.error(
            `Erro no tópico ${topic}, partição ${partition}, offset ${message.offset}:`,
            error
          );
          await sendToDLQ({
            originalTopic: "purchases-processed",
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

      // eachBatch: async ({ batch, resolveOffset, heartbeat }: any) => {
      //   // Processamento em lote (mais eficiente)
      // },
    });
  } catch (error) {
    console.error("Erro fatal, reiniciando em 10s...", error);
    setTimeout(consumerUserPurchasesProcessed, 10000);
  }
}

async function consumerUserPurchasesProcessedData(
  data: InterfacePaymentRequestDtos
) {
  if (!data.anti_duplication) return;
  console.log("consumer = purchases-processed:", data);

  //atualizar o status do pedido de pagamento no banco de dados
  await paymentRepository.updatePaymentRequest({
    id_transaction: String(data.anti_duplication.id),
    status: StatusPayment.AUTHORIZED,
  });

  return data;
}

async function sendToDLQ(dlqPayload: any) {
  try {
    await producerDlq.send({
      topic: "order_queue_consumer_dlq",
      messages: [
        {
          value: JSON.stringify(dlqPayload),
        },
      ],
    });
    console.log("Mensagem enviada para DLQ");
  } catch (dlqError: any) {
    console.error("FALHA CRÍTICA: Erro ao enviar para DLQ", dlqError);
  }
}
