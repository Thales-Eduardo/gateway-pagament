# Como iniciar o projeto

siga o passo a passo para iniciar o projeto em localhost na ordem

- Início dos containers dos arquivos docker compose.
- Faço a migração para o baco de dados em nos projetos `produto` e `process-purchases`

```bash
yarn prisma migration dev
```

- Va ate o dash do kafka control para criar os conectores e os sinks.

  - os connectors e sinks estão nas pastas `config` são os arquivos `.properties`
  - crie primeiro o `connector` depois o `sink`

- inicio o server do projeto `produto`

```bash
yarn dev
```

- crie os dados atraves de uma requisição no projeto de `process-purchases`

  - depois verifique se os dados estão no banco de dados do projeto
  - para isso pode usar o prisma studio.

```bash
yarn prisma studio
```

```bash
POST http://localhost:3333
```

- para criar os topics basta iniciar o server do projeto.
  - depois faça o mesmo no projeto `payment-processing`

```bash
yarn dev
```

-
