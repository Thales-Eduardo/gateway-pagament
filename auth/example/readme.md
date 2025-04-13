# Keycloak

Para as APIs validarem se o JWT foi gerado pelo Keycloak, usamos a chave pública fornecida pelo Keycloak.
Ou usar um API Gateway com o Keycloak.

Aqui você pega a chave pública, na propriedade "x5c": []
http://localhost:8080/realms/novo_realm/protocol/openid-connect/certs

Adicione em uma variável de ambiente.
