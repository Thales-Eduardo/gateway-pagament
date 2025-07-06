//recebe o pedido de pagamento // producer
import { AppErrors } from "../error/errors";
import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";
import { producerOrderQueue } from "../kafka/producers/add-to-order-queue";
import {
  PaymentRepository,
  StatusPayment,
} from "../repository/PaymentRepository";
import { ReservedProductRepository } from "../repository/ReservedProductRepository";
import { Validator } from "../validation/validate.price";

// produto: {
//   product_id: string;
//   user_id: string;
//   price: number;
//   quantity: number;
//   total_price: number;
// };

// card: {
//   card_number: string;
//   card_exp_month: string;
//   card_exp_year: string;
//   card_security_code: string;
// };

// data: Date;

// anti_duplication?: {
//   id: string;
//   user_id: string;
//   processed: boolean;
// };

export class ReceivePaymentRequest extends Validator {
  private database: any = {};

  constructor(
    private paymentRepository: PaymentRepository,
    private reservedProductRepository: ReservedProductRepository
  ) {
    super();
  }

  async execute({
    produto,
    card,
    data,
  }: InterfacePaymentRequestDtos): Promise<void> {
    const [findProduct, findProductReserved] = await Promise.all([
      this.paymentRepository.findbyIdProduct(produto.product_id),
      this.reservedProductRepository.findById(produto.reserve_id),
    ]);
    if (!findProduct || !findProductReserved) {
      throw new AppErrors("Produto não encontrado.");
    }

    if (findProductReserved.status === StatusPayment.AUTHORIZED) {
      throw new AppErrors("Seu pagamento já foi processado.");
    }

    findProduct.quantity = findProductReserved.quantity;

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
