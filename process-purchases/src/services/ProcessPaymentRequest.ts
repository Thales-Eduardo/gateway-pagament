import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";
import { producerProcessPurchess } from "../kafka/producers/process-purchases";
import { PaymentRepository } from "../repository/PaymentRepository";

//consumer
export class ProcessPaymentRequest {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(data: InterfacePaymentRequestDtos): Promise<any> {
    if (!data.anti_duplication) {
      throw new Error("Anti-duplication data is required.");
    }
    console.log("ProcessPaymentRequest - data:", data);
    // const antiDuplication = await this.paymentRepository.findAntiDuplication(
    //   data.anti_duplication.id
    // );

    // if (!antiDuplication || antiDuplication.process) return;

    // await this.paymentRepository.checkAndUpdateOptimistic(
    //   antiDuplication.id_transaction
    // );

    // Enviar para o tópico para processar a compra
    await producerProcessPurchess({
      produto: data.produto,
      card: data.card,
      data: data.data,
    });
  }
}
