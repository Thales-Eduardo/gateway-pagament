import { producerProcessPurchess } from "../kafka/producer";
import { InterfacePaymentRequestDtos, makePayment } from "./make_payment";

export async function processPaymentService(
  data: InterfacePaymentRequestDtos
): Promise<InterfacePaymentRequestDtos> {
  const result = await makePayment(data);

  if (!result) {
    // registrarErroPagamento(data);
    console.log("Pagamento não autorizado, enviando para DLQ");
  }

  await producerProcessPurchess(data);
  return data;
}
