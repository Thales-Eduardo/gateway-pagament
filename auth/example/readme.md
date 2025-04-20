# Keycloak

Para as APIs validarem se o JWT foi gerado pelo Keycloak, usamos a chave pública fornecida pelo Keycloak.
Ou usar um API Gateway com o Keycloak.

- para obter a cahve publica =>
  - http://localhost:8080/admin/master/console/#/master/realm-settings/keys
  - Algorithm RS256 => `Public key`

Adicione em uma variável de ambiente.

# Autorização

A API de produto, apenas os ADMs poderão ter acesso.

Para isso, vamos criar uma ROLE no Keycloak.

Depois disso, a info vira no decoded = "realm_access".

- Depois vamos precisar da chave pública para garantir que o token foi gerado pelo Keycloak.
  - Pegamos essa chave no Keycloak em configurações/realm-settings/keys, pegue do RS256.

# User / frontend

precisara acessar o panel do Keycloak para criar um usuario e a ROLE para selecionar se um usuário sera ou não adm, ou criar um front para isso
