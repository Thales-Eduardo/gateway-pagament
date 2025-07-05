import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";
import { producerOrderQueue } from "../kafka/producers/add-to-order-queue";
import { PaymentRepository } from "../repository/PaymentRepository";
export class RetryPagamentService {
  constructor(private paymentRepository: PaymentRepository) {}

  async checkCount(id_transaction: string): Promise<any> {
    const result = await this.paymentRepository.updateRetryCount(
      id_transaction
    );

    if (!result) return false;

    return result.retry_count;
  }

  async execute(data: any): Promise<any> {
    const message: InterfacePaymentRequestDtos = data.originalMessage;

    await this.paymentRepository.checkAndUpdateOptimistic({
      id_transaction: message.anti_duplication?.id ?? "",
      process: false,
    });

    await producerOrderQueue({
      produto: message.produto,
      card: message.card,
      data: message.data,
      anti_duplication: {
        id: message.anti_duplication?.id ?? "",
        user_id: message.produto.user_id,
        processed: message.anti_duplication?.processed ?? false,
      },
    });
  }
}
