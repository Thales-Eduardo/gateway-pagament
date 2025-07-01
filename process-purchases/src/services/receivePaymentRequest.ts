//recebe o pedido de pagamento // producer
import { AppErrors } from "../error/errors";
import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";
import { producerOrderQueue } from "../kafka/producers/add-to-order-queue";
import { PaymentRepository } from "../repository/PaymentRepository";
import { Validator } from "../validation/validate.price";

export class ReceivePaymentRequest extends Validator {
  private produto: InterfacePaymentRequestDtos["produto"] = {
    product_id: "",
    user_id: "",
    price: 0,
    quantity: 0,
    total_price: 0,
  };
  private database: any = {};

  constructor(private paymentRepository: PaymentRepository) {
    super();
    this.validate({
      database: this.database,
      produto: this.produto,
    });
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
    this.produto = produto;

    // verificar se usuário já tem um pedido igual ou menor que 2 minutos.
    const result = await this.paymentRepository.createPaymentRequest({
      produto,
      card,
      data,
    });

    if (result) {
      throw new AppErrors("Pedido de pagamento recusado, tente novamente.");
    }

    await this.paymentRepository.createRecordAntiDuplication(
      result.id, // ID register_payment_request
      produto.user_id,
      false
    );

    // Registra o pedido na fila.
    await producerOrderQueue({
      produto,
      card,
      data,
      anti_duplication: {
        id: result.id,
        user_id: produto.user_id,
        processed: false,
      },
    });
  }
}
