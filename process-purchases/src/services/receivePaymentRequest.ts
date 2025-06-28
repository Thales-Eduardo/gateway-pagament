//recebe o pedido de pagamento
// producer
import { AppErrors } from "../error/errors";
import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";
import { producerOrderQueue } from "../kafka/producers/add-to-order-queue";
import { PaymentRepository } from "../repository/PaymentRepository";

export class ReceivePaymentRequest {
  constructor(private paymentRepository: PaymentRepository) {}

  private compareDecimals(a: string | number, b: unknown): boolean {
    const numA = Number(parseFloat(String(a)).toFixed(4));
    const numB = Number(parseFloat(String(b)).toFixed(4));
    return numA === numB;
  }

  async execute({
    produto,
    card,
    data,
  }: InterfacePaymentRequestDtos): Promise<void> {
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

    if (!this.compareDecimals(produto.price, findProduct.price)) {
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
      result.id, // ID register_payment_request
      produto.user_id,
      false
    );

    // Registra o pedido na fila.
    await producerOrderQueue({
      produto,
      card,
      data,
    });
  }
}
