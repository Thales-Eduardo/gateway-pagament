-- Cria o usuário randomuser com acesso de qualquer host
CREATE USER IF NOT EXISTS 'randomuser'@'%' IDENTIFIED BY 'randomrootpassword';
-- Concede todas as permissões no schema process-purchases
GRANT ALL PRIVILEGES ON `process_purchases`.* TO 'randomuser'@'%';

-- Torna as alterações imediatas
FLUSH PRIVILEGES;

USE process_purchases;

CREATE TABLE IF NOT EXISTS product (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    createdAt BIGINT     NOT NULL,
    updatedAt BIGINT     NOT NULL,
    name      VARCHAR(255) NOT NULL,
    price     DOUBLE     NOT NULL,
    quantity  INT        NOT NULL
)
