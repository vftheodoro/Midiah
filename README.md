# 🖥️ Midiah - Plataforma de Mídia Digital para Telões

Sistema SaaS para venda de espaços publicitários em telões digitais.

## 🚀 Como Começar

### 1. Banco de Dados
1. Abra o XAMPP e inicie o MySQL
2. Abra o HeidiSQL
3. Execute o arquivo `database/schema.sql`

### 2. Site (Frontend)
Abra `site/index.html` no navegador ou use Live Server no VS Code.

### 3. API (Backend) - Em breve
```bash
cd api
pip install -r requirements.txt
python app.py
```

## 📁 Estrutura
```
Midiah/
├── docs/               → Documentação e planejamento
├── database/           → Scripts SQL
├── site/               → Frontend (HTML/CSS/JS)
│   ├── index.html      → Landing page
│   ├── login.html      → Tela de login
│   ├── cadastro.html   → Tela de cadastro
│   ├── cliente/        → Área do cliente (logado)
│   ├── admin/          → Área administrativa
│   ├── assets/         → CSS, JS, imagens
│   └── components/     → Partes reutilizáveis
├── api/                → Backend Python
└── player/             → App Electron (telão)
```

## 📅 Status
- [x] Planejamento geral
- [x] Schema do banco de dados
- [x] Mapa de telas
- [ ] Frontend - Telas do cliente
- [ ] Frontend - Painel admin
- [ ] Backend Python
- [ ] Integração PIX
- [ ] Player Electron
