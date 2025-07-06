# Gateway Payment

Este projeto é um sistema de gateway de pagamentos distribuído, com arquitetura baseada em microsserviços, filas Kafka e idempotência para garantir a integridade dos pedidos de pagamento.

## Visão Geral

O sistema é composto por múltiplos serviços, incluindo:

- **produto**: gerenciamento de produtos, integração com MySQL, Elasticsearch e Kafka.
- **process-purchases**: responsável pelo processamento de pedidos de pagamento, controle de duplicidade, filas Kafka e lógica de retry/dlq.
- **payment-processing**: processamento final dos pagamentos (detalhes dependem do serviço).

O fluxo principal envolve a recepção de pedidos, verificação de duplicidade, enfileiramento para processamento assíncrono e atualização do status do pagamento.

## Principais Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM (MySQL)
- Kafka (com Debezium e Kafka Connect)
- Docker Compose
- Elasticsearch

## Idempotência e Filas

O sistema utiliza uma tabela de anti-duplicação para garantir que pedidos repetidos em um curto espaço de tempo não sejam processados mais de uma vez. O fluxo de mensagens entre os serviços é feito via Kafka, com tratamento de retries e DLQ (Dead Letter Queue) para falhas.

## Documentação e Diagramas

- Diagramas UML e de fluxo estão disponíveis na pasta [`docs`](process-purchases/docs).
- Exemplos de payloads e explicações sobre idempotência estão no [`readme.md`](process-purchases/readme.md) de cada serviço.

## Scripts Úteis

- Subir ambiente: `docker-compose up -d`
- Rodar migrações: `yarn prisma migrate dev`
- Iniciar serviço: `yarn dev`
- Acessar Prisma Studio: `yarn prisma studio`

## Observações

- Os conectores Kafka e Elasticsearch são configurados via arquivos `.properties` em `config`.
- O projeto depende do Debezium para replicação de dados do MySQL para o Elasticsearch via Kafka Connect.
- O sistema implementa shutdown gracioso e tratamento de erros para garantir resiliência.

---

Para detalhes específicos de cada serviço, consulte os respectivos arquivos `readme.md` e a documentação na
