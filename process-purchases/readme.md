# idempotência queue

add jwt verificação

- Antes de entrar na fila, devemos garantir que cada pedido de pagamento seja único.
  - Uma estratégia seria colocar um time em cada pedido, assim checamos se existe um pedido de compra igual em um curto espaço de tempo para o mesmo usuário
- Já que vamos usar uma fila para background jobs, temos que garantir idempotência.
  - Antes de mandar o pedido de pagamento para o tópico de `process-purchases`, salvamos os IDs que forem entrar no tópico, assim vamos garantir que cada pedido de pagamento seja único.

**Exemplo**

![uml](./docs/process_purchases_flow.png)

"card": {
"amount": 100,
"number": "4111111111111111",
"exp_month": "03",
"exp_year": "2026",
"security_code": "123",
}
