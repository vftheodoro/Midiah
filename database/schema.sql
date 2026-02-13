-- ============================================================
-- MIDIAH - Schema do Banco de Dados
-- Plataforma de Mídia Digital para Telões
-- 
-- Compatível com: MySQL 5.7+ / MariaDB 10.3+ (XAMPP)
-- Rodar no HeidiSQL
-- ============================================================

-- Cria o banco de dados
CREATE DATABASE IF NOT EXISTS midiah
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE midiah;

-- ============================================================
-- 1. USERS (Clientes e Admins)
-- ============================================================
CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(150)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    senha_hash      VARCHAR(255)    NOT NULL,
    telefone        VARCHAR(20)     NULL,
    nome_negocio    VARCHAR(200)    NULL          COMMENT 'Nome do estabelecimento do cliente',
    tipo_usuario    ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
    ativo           TINYINT(1)      NOT NULL DEFAULT 1,
    avatar_url      VARCHAR(500)    NULL,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_tipo (tipo_usuario)
) ENGINE=InnoDB;

-- ============================================================
-- 2. PLAYERS (Os PCs nos telões - pode ter mais de um no futuro)
-- ============================================================
CREATE TABLE players (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100)    NOT NULL          COMMENT 'Ex: Telão Posto Guaricana',
    localizacao     VARCHAR(255)    NULL              COMMENT 'Endereço ou descrição do local',
    token_acesso    VARCHAR(255)    NOT NULL UNIQUE   COMMENT 'Token único para autenticação do player',
    loop_duracao    INT             NOT NULL DEFAULT 300    COMMENT 'Duração do loop em segundos (padrão 5min)',
    slot_duracao    INT             NOT NULL DEFAULT 15     COMMENT 'Duração de cada slot em segundos',
    status          ENUM('online', 'offline') NOT NULL DEFAULT 'offline',
    ultima_conexao  DATETIME        NULL              COMMENT 'Última vez que o player se comunicou',
    versao_playlist INT             NOT NULL DEFAULT 0      COMMENT 'Versão atual da playlist que está rodando',
    ativo           TINYINT(1)      NOT NULL DEFAULT 1,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_players_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 3. PLANS (Planos de venda)
-- ============================================================
CREATE TABLE plans (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100)    NOT NULL          COMMENT 'Ex: Semanal, Quinzenal, Mensal',
    descricao       TEXT            NULL,
    dias_duracao    INT             NOT NULL          COMMENT 'Duração em dias (7, 15, 30)',
    slots_por_loop  INT             NOT NULL DEFAULT 1 COMMENT 'Quantos slots o cliente compra por loop',
    valor           DECIMAL(10,2)   NOT NULL          COMMENT 'Preço em Reais',
    ativo           TINYINT(1)      NOT NULL DEFAULT 1,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_plans_ativo (ativo)
) ENGINE=InnoDB;

-- ============================================================
-- 4. CREATIVES (As mídias/anúncios)
-- ============================================================
CREATE TABLE creatives (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    titulo          VARCHAR(200)    NOT NULL          COMMENT 'Nome/título do anúncio',
    url_midia       VARCHAR(500)    NOT NULL          COMMENT 'URL ou path do arquivo de imagem/vídeo',
    tipo_midia      ENUM('imagem', 'video') NOT NULL DEFAULT 'imagem',
    duracao_seg     INT             NOT NULL DEFAULT 15     COMMENT 'Duração da exibição em segundos',
    largura_px      INT             NULL              COMMENT 'Largura da mídia em pixels',
    altura_px       INT             NULL              COMMENT 'Altura da mídia em pixels',
    tamanho_bytes   BIGINT          NULL              COMMENT 'Tamanho do arquivo em bytes',
    status          ENUM('pendente', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'pendente',
    motivo_rejeicao TEXT            NULL              COMMENT 'Preenchido pelo admin se rejeitado',
    aprovado_por    INT             NULL              COMMENT 'ID do admin que aprovou/rejeitou',
    aprovado_em     DATETIME        NULL,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_creatives_user     FOREIGN KEY (user_id)      REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_creatives_aprovador FOREIGN KEY (aprovado_por) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_creatives_user (user_id),
    INDEX idx_creatives_status (status),
    INDEX idx_creatives_tipo (tipo_midia)
) ENGINE=InnoDB;

-- ============================================================
-- 5. SUBSCRIPTIONS (Compras / Contratações)
-- ============================================================
CREATE TABLE subscriptions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    creative_id     INT             NOT NULL,
    plan_id         INT             NOT NULL,
    player_id       INT             NULL              COMMENT 'Em qual telão vai passar (NULL = todos)',
    data_inicio     DATE            NOT NULL,
    data_fim        DATE            NOT NULL,
    valor_pago      DECIMAL(10,2)   NOT NULL,
    status_pagamento ENUM('pendente', 'pago', 'expirado', 'cancelado', 'reembolsado') 
                    NOT NULL DEFAULT 'pendente',
    status_anuncio  ENUM('agendado', 'ativo', 'pausado', 'finalizado') 
                    NOT NULL DEFAULT 'agendado',
    pix_txid        VARCHAR(100)    NULL              COMMENT 'ID da transação PIX',
    pix_qrcode      TEXT            NULL              COMMENT 'QR Code PIX em base64 ou URL',
    pix_copia_cola  VARCHAR(500)    NULL              COMMENT 'Código PIX copia e cola',
    pago_em         DATETIME        NULL,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_subs_user      FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_subs_creative  FOREIGN KEY (creative_id) REFERENCES creatives(id) ON DELETE CASCADE,
    CONSTRAINT fk_subs_plan      FOREIGN KEY (plan_id)     REFERENCES plans(id) ON DELETE RESTRICT,
    CONSTRAINT fk_subs_player    FOREIGN KEY (player_id)   REFERENCES players(id) ON DELETE SET NULL,
    
    INDEX idx_subs_user (user_id),
    INDEX idx_subs_status_pag (status_pagamento),
    INDEX idx_subs_status_anun (status_anuncio),
    INDEX idx_subs_datas (data_inicio, data_fim),
    INDEX idx_subs_creative (creative_id)
) ENGINE=InnoDB;

-- ============================================================
-- 6. PLAYLIST_ITEMS (Itens da playlist ativa de cada player)
-- ============================================================
CREATE TABLE playlist_items (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    player_id       INT             NOT NULL,
    subscription_id INT             NOT NULL,
    creative_id     INT             NOT NULL,
    ordem           INT             NOT NULL DEFAULT 0  COMMENT 'Posição no loop (0, 1, 2...)',
    ativo           TINYINT(1)      NOT NULL DEFAULT 1,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_playlist_player FOREIGN KEY (player_id)       REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT fk_playlist_sub    FOREIGN KEY (subscription_id)  REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT fk_playlist_creative FOREIGN KEY (creative_id)   REFERENCES creatives(id) ON DELETE CASCADE,
    
    INDEX idx_playlist_player (player_id, ativo, ordem),
    UNIQUE KEY uk_playlist_slot (player_id, ordem, ativo)
) ENGINE=InnoDB;

-- ============================================================
-- 7. PLAY_LOGS (Auditoria - registro de cada exibição)
-- ============================================================
CREATE TABLE play_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id       INT             NOT NULL,
    creative_id     INT             NOT NULL,
    subscription_id INT             NULL,
    exibido_em      DATETIME        NOT NULL          COMMENT 'Momento exato em que a mídia apareceu no telão',
    duracao_real    INT             NULL              COMMENT 'Duração real da exibição em segundos',
    
    CONSTRAINT fk_logs_player    FOREIGN KEY (player_id)  REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT fk_logs_creative  FOREIGN KEY (creative_id) REFERENCES creatives(id) ON DELETE CASCADE,
    
    INDEX idx_logs_creative (creative_id, exibido_em),
    INDEX idx_logs_player (player_id, exibido_em),
    INDEX idx_logs_data (exibido_em)
) ENGINE=InnoDB;

-- ============================================================
-- 8. PAYMENTS (Histórico detalhado de pagamentos)
-- ============================================================
CREATE TABLE payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    subscription_id INT             NOT NULL,
    user_id         INT             NOT NULL,
    valor           DECIMAL(10,2)   NOT NULL,
    metodo          ENUM('pix', 'boleto', 'cartao', 'manual') NOT NULL DEFAULT 'pix',
    status          ENUM('pendente', 'processando', 'aprovado', 'rejeitado', 'estornado') 
                    NOT NULL DEFAULT 'pendente',
    gateway_id      VARCHAR(255)    NULL              COMMENT 'ID na gateway de pagamento',
    gateway_resp    JSON            NULL              COMMENT 'Resposta completa da gateway (JSON)',
    pago_em         DATETIME        NULL,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pay_sub   FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT fk_pay_user  FOREIGN KEY (user_id)         REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_pay_sub (subscription_id),
    INDEX idx_pay_user (user_id),
    INDEX idx_pay_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 9. NOTIFICATIONS (Notificações internas)
-- ============================================================
CREATE TABLE notifications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    titulo          VARCHAR(200)    NOT NULL,
    mensagem        TEXT            NOT NULL,
    tipo            ENUM('info', 'sucesso', 'alerta', 'erro') NOT NULL DEFAULT 'info',
    lida            TINYINT(1)      NOT NULL DEFAULT 0,
    link            VARCHAR(500)    NULL              COMMENT 'URL para redirecionamento ao clicar',
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_notif_user (user_id, lida),
    INDEX idx_notif_data (criado_em)
) ENGINE=InnoDB;

-- ============================================================
-- 10. SETTINGS (Configurações gerais do sistema)
-- ============================================================
CREATE TABLE settings (
    chave           VARCHAR(100)    PRIMARY KEY,
    valor           TEXT            NOT NULL,
    descricao       VARCHAR(255)    NULL,
    atualizado_em   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- DADOS INICIAIS (Seeds)
-- ============================================================

-- Admin padrão (senha: admin123 - TROCAR EM PRODUÇÃO!)
-- Hash bcrypt de "admin123"
INSERT INTO users (nome, email, senha_hash, telefone, tipo_usuario) VALUES
('Administrador', 'admin@midiah.com.br', '$2b$12$LJ3m4ys6Hy6RqRfMBIiHNOk5DQYwzGkGz4F3mVxN2KjFfXpMhGXi', '(41) 99999-9999', 'admin');

-- Player padrão (Telão do Posto)
INSERT INTO players (nome, localizacao, token_acesso, loop_duracao, slot_duracao) VALUES
('Telão Posto Guaricana', 'Posto Guaricana - Av. Principal, 1000', 'player_token_guaricana_2026_secreto', 300, 15);

-- Planos de exemplo
INSERT INTO plans (nome, descricao, dias_duracao, slots_por_loop, valor) VALUES
('Semanal',    '1 slot por 7 dias - Sua propaganda aparece a cada 5 minutos, ~192 vezes por dia.',  7,  1, 100.00),
('Quinzenal',  '1 slot por 15 dias - Maior exposição com desconto.',                                 15, 1, 180.00),
('Mensal',     '1 slot por 30 dias - Melhor custo-benefício para presença contínua.',                 30, 1, 300.00),
('Semanal VIP','2 slots por 7 dias - Aparece 2x a cada loop, dobro de exposição!',                   7,  2, 180.00);

-- Configurações iniciais do sistema
INSERT INTO settings (chave, valor, descricao) VALUES
('site_nome',           'Midiah',                               'Nome do sistema'),
('site_descricao',      'Plataforma de Mídia Digital',          'Descrição curta'),
('pix_chave',           'email@midiah.com.br',                  'Chave PIX para recebimento'),
('pix_gateway',         'efipay',                               'Gateway de pagamento PIX'),
('upload_max_mb',       '50',                                   'Tamanho máximo de upload em MB'),
('formatos_aceitos',    'jpg,jpeg,png,mp4,webm',                'Formatos de mídia aceitos'),
('resolucao_min_w',     '1920',                                 'Largura mínima da mídia em pixels'),
('resolucao_min_h',     '1080',                                 'Altura mínima da mídia em pixels'),
('email_notificacao',   'admin@midiah.com.br',                  'Email para notificações do admin'),
('horario_inicio',      '06:00',                                'Horário de início de exibição'),
('horario_fim',         '22:00',                                'Horário de fim de exibição');


-- ============================================================
-- VIEWS ÚTEIS (Consultas prontas)
-- ============================================================

-- View: Anúncios ativos hoje (para o Player montar a playlist)
CREATE OR REPLACE VIEW vw_playlist_ativa AS
SELECT 
    pi.player_id,
    pi.ordem,
    c.id AS creative_id,
    c.titulo,
    c.url_midia,
    c.tipo_midia,
    c.duracao_seg,
    s.data_inicio,
    s.data_fim,
    u.nome_negocio AS anunciante
FROM playlist_items pi
INNER JOIN subscriptions s ON s.id = pi.subscription_id
INNER JOIN creatives c ON c.id = pi.creative_id
INNER JOIN users u ON u.id = s.user_id
WHERE pi.ativo = 1
  AND s.status_pagamento = 'pago'
  AND s.status_anuncio = 'ativo'
  AND c.status = 'aprovado'
  AND CURDATE() BETWEEN s.data_inicio AND s.data_fim
ORDER BY pi.player_id, pi.ordem;

-- View: Resumo de exibições por anúncio (para o dashboard do cliente)
CREATE OR REPLACE VIEW vw_exibicoes_resumo AS
SELECT 
    c.id AS creative_id,
    c.user_id,
    c.titulo,
    COUNT(pl.id) AS total_exibicoes,
    COUNT(CASE WHEN DATE(pl.exibido_em) = CURDATE() THEN 1 END) AS exibicoes_hoje,
    MAX(pl.exibido_em) AS ultima_exibicao
FROM creatives c
LEFT JOIN play_logs pl ON pl.creative_id = c.id
GROUP BY c.id, c.user_id, c.titulo;

-- View: Ocupação de slots por player
CREATE OR REPLACE VIEW vw_ocupacao_slots AS
SELECT 
    p.id AS player_id,
    p.nome AS player_nome,
    p.loop_duracao,
    p.slot_duracao,
    FLOOR(p.loop_duracao / p.slot_duracao) AS total_slots,
    COUNT(CASE WHEN pi.ativo = 1 THEN 1 END) AS slots_ocupados,
    FLOOR(p.loop_duracao / p.slot_duracao) - COUNT(CASE WHEN pi.ativo = 1 THEN 1 END) AS slots_livres
FROM players p
LEFT JOIN playlist_items pi ON pi.player_id = p.id
    AND pi.subscription_id IN (
        SELECT s.id FROM subscriptions s 
        WHERE s.status_pagamento = 'pago' 
          AND s.status_anuncio = 'ativo'
          AND CURDATE() BETWEEN s.data_inicio AND s.data_fim
    )
GROUP BY p.id, p.nome, p.loop_duracao, p.slot_duracao;


-- ============================================================
-- FIM DO SCHEMA
-- Próximo passo: rodar este SQL no HeidiSQL via XAMPP
-- ============================================================
