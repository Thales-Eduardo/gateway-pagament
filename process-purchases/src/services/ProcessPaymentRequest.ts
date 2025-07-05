import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";
import { producerProcessPurchess } from "../kafka/producers/process-purchases";
import {
  PaymentRepository,
  StatusPayment,
} from "../repository/PaymentRepository";

//consumer
export class ProcessPaymentRequest {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(data: InterfacePaymentRequestDtos): Promise<any> {
    if (!data.anti_duplication) {
      throw new Error("Anti-duplication data is required.");
    }
    const antiDuplication = await this.paymentRepository.findAntiDuplication(
      data.anti_duplication.id
    );

    if (!antiDuplication || antiDuplication.process) {
      console.log("Pedido de pagamento já processado");
      return;
    }

    await Promise.all([
      this.paymentRepository.checkAndUpdateOptimistic({
        id_transaction: antiDuplication.id_transaction,
        process: true,
      }),
      this.paymentRepository.updatePaymentRequest({
        id_transaction: antiDuplication.id_transaction,
        status: StatusPayment.PENDING,
      }),
    ]);

    // Enviar para o tópico para processar a compra
    await producerProcessPurchess({
      produto: data.produto,
      card: data.card,
      data: data.data,
      anti_duplication: {
        id: antiDuplication.id_transaction,
        user_id: data.produto.user_id,
        processed: false,
      },
    });
  }
}
