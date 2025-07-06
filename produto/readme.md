# Produto - Microserviço de Produtos

Este projeto faz parte do sistema de gateway de pagamentos e é responsável pelo gerenciamento de produtos, integração com MySQL, Elasticsearch e Kafka.

## Tecnologias Utilizadas

- Node.js + TypeScript
- Express
- Prisma ORM (MySQL)
- Elasticsearch
- Kafka (Debezium, Kafka Connect)
- Docker Compose
  ``

## Endpoints principais

- `GET /findAll` — Lista todos os produtos (Elasticsearch)
- `GET /findById/:id` — Busca produto por ID (Elasticsearch)
- `GET /findByName/:name` — Busca produto por nome (Elasticsearch)
- `POST /` — Popula o banco com produtos de exemplo
- `POST /reserve` — Reserva um produto

## Observações

- Os conectores Kafka e Elasticsearch são configurados via arquivos `.properties` em [`config/connectors`](produto/config/connectors).
- O projeto depende do Debezium para replicação de dados do MySQL para o Elasticsearch via Kafka Connect.

---

Para mais detalhes, consulte o arquivo [`executar_projeto.md`](executar_projeto.md).
