// pegar o pedido da fila.

import { InterfacePaymentRequestDtos } from "../interfaces/paymentRequest.dtos";

// ir na tabela de anti_duplication e verificar o valor de process.
// se process for true ignore/continue
// se process for false na mesma query atualiza para true e garanta que seja o único no banco

// enviar para topic para processar a compra

//consumer

export class ProcessPaymentRequest {
  async execute(data: InterfacePaymentRequestDtos): Promise<any> {}
}
