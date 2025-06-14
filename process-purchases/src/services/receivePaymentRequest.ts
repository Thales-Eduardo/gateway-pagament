//recebe o pedido de pagamento

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
  async execute({
    produto,
    card,
    data,
  }: ReceivePaymentRequestDtos): Promise<any> {
    // producer

    // verificar se esse usuário já tem um pedido igual na tabela de register_payment_request,
    // Se sim, verificar se o pedido tem menos de 1-2 minutos de registro.

    //registrar o pedido na tabela de anti_duplication com o process: false
    // Registra o pedido na fila.

    //adicionar estratégia de DLQ em caso de erro
    return "";
  }
}
