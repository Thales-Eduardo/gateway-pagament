//recebe o pedido de pagamento // producer
import { AppErrors } from "../error/errors";
import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";
import { producerOrderQueue } from "../kafka/producers/add-to-order-queue";
import { PaymentRepository } from "../repository/PaymentRepository";
import { Validator } from "../validation/validate.price";

export class ReceivePaymentRequest extends Validator {
  private database: any = {};

  constructor(private paymentRepository: PaymentRepository) {
    super();
  }

  async execute({
    produto,
    card,
    data,
  }: InterfacePaymentRequestDtos): Promise<void> {
    const findProduct = await this.paymentRepository.findbyIdProduct(
      produto.product_id
    );
    if (!findProduct) throw new AppErrors("Produto não encontrado.");
    this.database = findProduct;
    this.validate({
      database: this.database,
      produto: produto,
    });

    // verificar se usuário já tem um pedido igual ou menor que 2 minutos.
    const result = await this.paymentRepository.createPaymentRequest({
      produto,
      card,
      data,
    });

    if (!result) {
      throw new AppErrors(
        "Pedido de pagamento recusado, tente novamente.",
        409
      );
    }

    await this.paymentRepository.createRecordAntiDuplication({
      id_transaction: result.id,
      user_id: produto.user_id,
      process: false,
    });

    // Registra o pedido na fila.
    await producerOrderQueue({
      message: {
        produto,
        card,
        data,
        anti_duplication: {
          id: result.id,
          user_id: produto.user_id,
          processed: false,
        },
      },
    });
  }
}
