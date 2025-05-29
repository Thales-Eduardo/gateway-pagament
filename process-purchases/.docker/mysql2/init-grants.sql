-- Cria o usuário randomuser com acesso de qualquer host
CREATE USER IF NOT EXISTS 'randomuser'@'%' IDENTIFIED BY 'randomrootpassword';
-- Concede todas as permissões no schema process-purchases
GRANT ALL PRIVILEGES ON `process_purchases`.* TO 'randomuser'@'%';

-- Torna as alterações imediatas
FLUSH PRIVILEGES;
