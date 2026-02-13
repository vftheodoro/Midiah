# 🖥️ MIDIAH - Plano Geral do Projeto

## Plataforma de Mídia Digital para Telões

**Data de Início:** Fevereiro 2026  
**Versão do Plano:** 1.0

---

## 📋 Visão Geral

O **Midiah** é uma plataforma SaaS para venda de espaços publicitários em telões digitais. 
O sistema permite que comerciantes locais comprem slots de propaganda que são exibidos em 
telões instalados em locais de grande circulação (postos de gasolina, mercados, etc.).

---

## 🧠 Modelo de Negócios

| Conceito     | Valor                                          |
| ------------ | ---------------------------------------------- |
| **Loop**     | 5 minutos (300 segundos)                       |
| **Slot**     | 15 segundos cada                               |
| **Capacidade** | 20 slots por loop                            |
| **Repetições/dia** | 288 loops (24h) ou ~192 loops (16h úteis) |
| **Produto**  | "1 slot por 7 dias" = aparece ~192x/dia        |
| **Preço base** | R$ 100,00/semana por slot                    |
| **Pagamento** | PIX (com callback automático)                 |

---

## 🏗️ Arquitetura do Sistema (3 Partes)

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET                              │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │  SITE/PAINEL │    │  API/BACKEND │    │  PLAYER PC │ │
│  │  (Frontend)  │◄──►│  (Servidor)  │◄──►│  (Telão)   │ │
│  │              │    │              │    │            │  │
│  │  - Cliente   │    │  - REST API  │    │  - Electron│  │
│  │  - Admin     │    │  - Auth      │    │  - Cache   │  │
│  │  - Pagamento │    │  - PIX       │    │  - Offline │  │
│  └──────────────┘    │  - Playlist  │    └────────────┘  │
│                      │  - WebSocket │                    │
│                      └──────┬───────┘                    │
│                             │                            │
│                      ┌──────┴───────┐                    │
│                      │  BANCO DE    │                    │
│                      │  DADOS MySQL │                    │
│                      │  + Storage   │                    │
│                      └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Fase 1 (MVP - Onde estamos)
| Camada       | Tecnologia                          | Motivo                              |
| ------------ | ----------------------------------- | ----------------------------------- |
| **Frontend** | HTML + CSS + JavaScript puro        | Simplicidade, controle total        |
| **Backend**  | Python (Flask ou FastAPI)           | Rápido de desenvolver, fácil PIX    |
| **Banco**    | MySQL (XAMPP + HeidiSQL)            | Já possui ambiente configurado      |
| **Storage**  | Pasta local no servidor / Supabase  | Imagens dos anúncios                |
| **Player**   | Electron (HTML/CSS/JS)              | Desktop com cache offline           |

### Fase 2 (Escala - Futuro)
| Camada       | Tecnologia                          |
| ------------ | ----------------------------------- |
| **Frontend** | React ou Next.js                    |
| **Backend**  | Node.js (NestJS) ou manter Python  |
| **Banco**    | PostgreSQL                          |
| **Storage**  | AWS S3 / Supabase Storage           |
| **Pagamento**| API PIX (Mercado Pago / Asaas / EfiPay) |

---

## 📊 Estrutura do Banco de Dados

### Diagrama de Relacionamento (ER)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   users      │     │  creatives   │     │   plans      │
│─────────────│     │──────────────│     │─────────────│
│ id (PK)      │◄─┐  │ id (PK)      │     │ id (PK)      │
│ nome         │  │  │ user_id (FK) │─────│ nome         │
│ email        │  │  │ url_midia    │     │ dias_duracao │
│ senha_hash   │  │  │ tipo         │     │ valor        │
│ telefone     │  │  │ duracao_seg  │     │ slots        │
│ tipo_usuario │  │  │ status       │     │ seg_por_slot │
│ criado_em    │  │  │ criado_em    │     └─────────────┘
└─────────────┘  │  └──────────────┘           │
                  │                              │
                  │  ┌───────────────────┐       │
                  │  │  subscriptions    │       │
                  │  │───────────────────│       │
                  └──│ user_id (FK)      │       │
                     │ creative_id (FK)  │───────┘
                     │ plan_id (FK)      │
                     │ data_inicio       │
                     │ data_fim          │
                     │ status_pagamento  │
                     │ pix_txid          │
                     └───────────────────┘
                              │
                     ┌────────┴────────┐
                     │   play_logs     │
                     │─────────────────│
                     │ creative_id(FK) │
                     │ data_hora       │
                     │ player_id       │
                     └─────────────────┘
```

### Tabelas (ver arquivo SQL separado)

---

## 🎨 Mapa de Telas - Site do CLIENTE

### Telas Públicas (sem login)
```
1. HOME (Landing Page)
   ├── Hero: "Anuncie no maior telão da região"
   ├── Como Funciona (3 passos)
   ├── Planos e Preços
   ├── Depoimentos / Cases
   └── CTA: "Comece Agora"

2. LOGIN
   ├── Email + Senha
   ├── "Esqueci minha senha"
   └── Link para Cadastro

3. CADASTRO
   ├── Nome completo
   ├── Email
   ├── Telefone (WhatsApp)
   ├── Nome do negócio
   ├── Senha + Confirmação
   └── Aceitar termos
```

### Telas do Cliente (com login)
```
4. DASHBOARD DO CLIENTE
   ├── Resumo: "Seu anúncio foi exibido X vezes hoje"
   ├── Status dos anúncios ativos
   ├── Próximos vencimentos
   └── Atalho: "Criar novo anúncio"

5. MEUS ANÚNCIOS (Lista)
   ├── Cards com: thumbnail, status, período, views
   ├── Filtros: Ativos / Pendentes / Expirados
   └── Botão: "+ Novo Anúncio"

6. NOVO ANÚNCIO (Wizard - Passo a Passo)
   │
   ├── Passo 1: ESCOLHER PLANO
   │   ├── Cards de planos (7 dias, 15 dias, 30 dias)
   │   ├── Preço, quantidade de exibições estimadas
   │   └── Botão: "Selecionar"
   │
   ├── Passo 2: UPLOAD DA MÍDIA
   │   ├── Drag & Drop de imagem ou vídeo
   │   ├── Preview em tempo real
   │   ├── Requisitos: resolução mínima, formatos aceitos, duração max
   │   └── Botão: "Próximo"
   │
   ├── Passo 3: AGENDAR
   │   ├── Calendário: Data de início
   │   ├── Data de fim (calculada automaticamente)
   │   └── Botão: "Ir para Pagamento"
   │
   └── Passo 4: PAGAMENTO
       ├── Resumo do pedido
       ├── QR Code PIX
       ├── Código "Copia e Cola"
       ├── Timer de expiração (30 min)
       └── Status: "Aguardando pagamento..."
             └── Após pagar: "Pagamento confirmado! ✅"

7. DETALHES DO ANÚNCIO
   ├── Imagem/Vídeo em preview
   ├── Status: Pendente / Aprovado / Rejeitado / Ativo / Expirado
   ├── Período: 05/02 a 12/02
   ├── Exibições totais: 1.542
   ├── Gráfico simples de exibições por dia
   └── Se rejeitado: Motivo da rejeição + botão "Reenviar"

8. MINHA CONTA
   ├── Editar dados pessoais
   ├── Alterar senha
   ├── Histórico de pagamentos
   └── Sair
```

### Telas do ADMIN
```
9. DASHBOARD ADMIN
   ├── Receita do mês
   ├── Anúncios ativos / slots ocupados / slots livres
   ├── Status do Player (online/offline)
   └── Alertas (pagamentos pendentes, anúncios para aprovar)

10. APROVAR ANÚNCIOS
    ├── Lista de anúncios com status "Pendente"
    ├── Preview da mídia
    ├── Dados do cliente
    ├── Botões: ✅ Aprovar | ❌ Rejeitar (com campo de motivo)
    └── Histórico de aprovações

11. GESTÃO DE PLANOS
    ├── CRUD de planos (criar, editar, desativar)
    └── Definir preços e durações

12. GESTÃO FINANCEIRA
    ├── Pagamentos recebidos
    ├── Pagamentos pendentes
    ├── Relatório por período
    └── Exportar CSV

13. PLAYLIST ATIVA
    ├── Visualização do loop atual
    ├── Ordem dos slots
    ├── Drag & Drop para reordenar
    └── Preview simulando o telão

14. STATUS DO PLAYER
    ├── Online / Offline
    ├── Última comunicação
    ├── Versão da playlist em uso
    └── Logs recentes
```

---

## 🔄 Fluxo Principal do Sistema

```
CLIENTE                    SISTEMA                     ADMIN
  │                          │                           │
  ├─ 1. Cadastra-se ────────►│                           │
  │                          │                           │
  ├─ 2. Escolhe plano ──────►│                           │
  │                          │                           │
  ├─ 3. Upload mídia ───────►│                           │
  │                          │                           │
  ├─ 4. Paga PIX ───────────►│─── 5. Notifica ─────────►│
  │                          │                           │
  │                          │◄── 6. Aprova anúncio ─────┤
  │                          │                           │
  │                          │─── 7. Adiciona à ────────►│ PLAYLIST
  │                          │      playlist             │
  │                          │                           │
  │                       PLAYER                         │
  │                          │                           │
  │                          ├─ 8. Detecta atualização   │
  │                          ├─ 9. Baixa nova mídia      │
  │                          ├─ 10. Exibe no telão       │
  │                          └─ 11. Reporta exibições    │
  │                          │                           │
  ├─ 12. Vê relatório ◄─────│                           │
```

---

## 📁 Estrutura de Pastas do Projeto

```
Midiah/
├── docs/                      # Documentação e planejamento
│   ├── 01-PLANO-GERAL.md
│   ├── 02-MAPA-TELAS.md
│   └── designs/               # Seus designs prontos
│
├── database/                  # Scripts SQL
│   └── schema.sql             # Criação do banco
│
├── site/                      # Frontend (HTML/CSS/JS)
│   ├── index.html             # Landing page
│   ├── login.html
│   ├── cadastro.html
│   ├── cliente/               # Área do cliente
│   │   ├── dashboard.html
│   │   ├── meus-anuncios.html
│   │   ├── novo-anuncio.html
│   │   ├── detalhes-anuncio.html
│   │   └── minha-conta.html
│   ├── admin/                 # Área administrativa
│   │   ├── dashboard.html
│   │   ├── aprovar.html
│   │   ├── planos.html
│   │   ├── financeiro.html
│   │   ├── playlist.html
│   │   └── player-status.html
│   ├── assets/
│   │   ├── css/
│   │   │   ├── global.css     # Reset, variáveis, tipografia
│   │   │   ├── components.css # Botões, cards, forms, modals
│   │   │   ├── layout.css     # Header, sidebar, grid
│   │   │   └── pages/         # CSS específico por página
│   │   ├── js/
│   │   │   ├── api.js         # Funções de comunicação com backend
│   │   │   ├── auth.js        # Login, logout, token
│   │   │   ├── utils.js       # Formatação, validação
│   │   │   └── pages/         # JS específico por página
│   │   └── img/               # Ícones, logos, ilustrações
│   └── components/            # Partes reutilizáveis (header, footer, sidebar)
│
├── api/                       # Backend Python
│   ├── app.py                 # Entry point
│   ├── config.py              # Configurações (DB, PIX, etc.)
│   ├── routes/
│   │   ├── auth.py            # Login, cadastro, token
│   │   ├── creatives.py       # CRUD de anúncios/mídias
│   │   ├── plans.py           # Planos disponíveis
│   │   ├── subscriptions.py   # Compras/assinaturas
│   │   ├── payments.py        # PIX, callbacks
│   │   ├── playlist.py        # Playlist ativa para o player
│   │   ├── player.py          # Heartbeat, sync, logs
│   │   └── admin.py           # Aprovações, relatórios
│   ├── models/                # Modelos do banco
│   ├── services/              # Lógica de negócio
│   └── requirements.txt
│
├── player/                    # Electron App (futuro)
│   ├── main.js
│   ├── renderer/
│   └── cache/
│
└── README.md
```

---

## 📅 Roadmap de Desenvolvimento (Fases)

### 🔵 FASE 1 - Fundação (Estamos aqui)
- [x] Planejamento geral
- [ ] Schema do banco de dados (SQL para XAMPP)
- [ ] Telas do site do cliente (HTML/CSS/JS)
- [ ] Telas do painel admin (HTML/CSS/JS)

### 🟡 FASE 2 - Backend
- [ ] API Python (Flask/FastAPI)
- [ ] Autenticação (JWT)
- [ ] CRUD de anúncios
- [ ] Upload de mídias
- [ ] Sistema de aprovação

### 🟠 FASE 3 - Pagamento
- [ ] Integração PIX (EfiPay/Asaas/MercadoPago)
- [ ] Callback automático
- [ ] Gestão financeira

### 🔴 FASE 4 - Player
- [ ] App Electron
- [ ] Cache local (offline mode)
- [ ] Sincronização com API
- [ ] Sistema de heartbeat

### 🟢 FASE 5 - Polimento
- [ ] Relatórios e gráficos
- [ ] Notificações (email/WhatsApp)
- [ ] Otimização de performance
- [ ] Testes e deploy

---

## 🎯 Próximo Passo

**Começar pelas telas do site do cliente**, já que você tem designs prontos.
Ordem sugerida:
1. ✅ SQL do banco de dados
2. Landing page (index.html)
3. Login + Cadastro
4. Dashboard do cliente
5. Wizard de novo anúncio
6. Lista de anúncios
7. Detalhes do anúncio
