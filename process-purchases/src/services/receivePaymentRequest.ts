//recebe o pedido de pagamento
// producer
import { AppErrors } from "../error/errors";
import { producerOrderQueue } from "../kafka/producers/add-to-order-queue";
import { PaymentRepository } from "../repository/PaymentRepository";

export interface ReceivePaymentRequestDtos {
  produto: {
    product_id: string;
    user_id: string;
    price: number;
    quantity: number;
  };

  card: {
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_security_code: string;
  };

  data: Date;
}

export class ReceivePaymentRequest {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute({
    produto,
    card,
    data,
  }: ReceivePaymentRequestDtos): Promise<any> {
    const findProduct = await this.paymentRepository.findbyIdProduct(
      produto.product_id
    );
    if (!findProduct) {
      throw new AppErrors("Produto não encontrado.");
    }
    if (produto.quantity <= 0) {
      throw new AppErrors("Quantidade deve ser positiva");
    }
    if (produto.quantity > findProduct.quantity) {
      throw new AppErrors(
        `Quantidade indisponível. Solicitação: ${produto.quantity}, Disponível: ${findProduct.quantity}`
      );
    }
    const PRICE_TOLERANCE = 0.01;
    const priceDifference = Math.abs(produto.price - findProduct.price);
    if (priceDifference > PRICE_TOLERANCE) {
      throw new AppErrors(
        `Preço inconsistente. Esperado: ${findProduct.price}, Recebido: ${produto.price}`
      );
    }

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
      result.id,
      produto.user_id,
      false
    );

    // Registra o pedido na fila.
    await producerOrderQueue({
      produto,
      card,
      data,
    });

    return "";
  }
}
