import { producerProcessPurchess } from "../kafka/producers/producer";
import { producerPaymentRetry } from "../kafka/producers/producer_payment_retry";
import { InterfacePaymentRequestDtos } from "./make_payment";

export async function processPaymentService(
  data: InterfacePaymentRequestDtos
): Promise<InterfacePaymentRequestDtos | undefined> {
  const result = true; // Simulating payment processing success for demonstration purposes

  // const result = await makePayment(data);

  if (!result) {
    await producerPaymentRetry({
      originalTopic: "purchases-processed",
      originalMessage: data,
      error: {
        name: "processPaymentService",
        message: "Failed to process.",
        stack: "Error: Failed to process",
        code: "PaymentProcessingError",
      },
      timestamp: new Date().toISOString(),
    });

    return;
  }
  await producerProcessPurchess(data);

  return data;
}
