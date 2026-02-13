# Melhorias de Responsividade Mobile - Midiah

## 📱 Visão Geral
Revisão completa da estilização mobile para todo o site Midiah, incluindo landing page, área do cliente e painel administrativo.

## 🎯 Breakpoints Implementados

### Breakpoints Principais
- **1200px**: Tablets landscape
- **968px**: Tablets portrait / Menu mobile ativado
- **768px**: Smartphones landscape
- **640px**: Smartphones portrait (médio)
- **480px**: Smartphones portrait (pequeno)
- **380px**: Smartphones extra pequenos

## 🔧 Melhorias Implementadas

### 1. Sistema de Menu Mobile
**Arquivos**: `mobile-menu.js`, `global.css`

✅ Botão hamburger com ícone animado (menu/X)
✅ Sidebar deslizante com animação suave
✅ Overlay escuro para foco
✅ Fecha ao clicar fora ou em links
✅ Previne scroll do body quando aberto
✅ Funciona tanto no cliente quanto no admin

### 2. Otimizações de Layout

#### Landing Page (`landing.css`)
- Grid de steps e planos: 3 cols → 1 col
- Hero title responsivo: 3.5rem → 2.5rem → 2rem → 1.75rem
- Footer: flex column em mobile
- Botões CTAs: width 100% em mobile
- Nav links: escondidos < 968px

#### Dashboard Cliente (`dashboard.css`)
- **Stats grid**: 4 cols → 2 cols → 1 col
- **Sidebar**: 240px fixa → deslizante mobile
- **Charts**: grid 2fr/1fr → 1 col mobile
- **Tables**: scroll horizontal com min-width
- **Location cards**: grid responsivo
- **Billing summary**: 3 cols → 1 col
- **Settings**: sidebar horizontal scroll mobile
- **Forms**: 2 cols → 1 col mobile
- **Heatmap**: 24 cols → 6 cols → 4 cols

#### Admin (`admin.css`)
- **Sidebar**: 220px fixa → deslizante mobile
- **Stats**: 4 cols → 2 cols → 1 col
- **Campaign cards**: 3 cols → 2 cols → 1 col
- **Tables**: scroll horizontal
- **Approval cards**: flex column mobile
- **Client/Player cards**: vertical layout mobile

### 3. Componentes Específicos Mobile

#### Botões
```css
- Min-height: 44px (Apple guidelines)
- Touch feedback visual (opacity)
- Width 100% em contexts estreitos
- Ícones: 36px em mobile pequeno
```

#### Inputs
```css
- Font-size: 16px (previne zoom iOS)
- Min-height: 44px
- -webkit-appearance: none (iOS)
- Scroll para view quando focado
```

#### Tabelas
```css
- Overflow-x: auto
- Min-width em mobile
- Font-size reduzido: 0.8rem
- Padding reduzido em células
```

### 4. Melhorias de Performance Mobile
**Arquivo**: `mobile-enhancements.js`

✅ **Smooth scroll** com requestAnimationFrame
✅ **Lazy loading** de imagens com IntersectionObserver
✅ **Touch feedback** visual para todos botões
✅ **Detecção de orientação** (portrait/landscape)
✅ **Previne zoom duplo-toque** (iOS)
✅ **Viewport height fix** (100vh problem)
✅ **Safe area** para notch/punch hole
✅ **Indicador offline**
✅ **Skeleton loading states**
✅ **Classes de plataforma** (.ios, .android, .mobile)

### 5. Otimizações de Touch

```css
/* Área de toque mínima */
min-height: 44px;
min-width: 44px;

/* Highlight ao tocar */
-webkit-tap-highlight-color: rgba(255, 200, 0, 0.2);

/* Previne seleção em double tap */
-webkit-user-select: none;
```

### 6. Ajustes de Tipografia

| Elemento | Desktop | Tablet | Mobile | Small |
|----------|---------|--------|--------|-------|
| h1       | 3.5rem  | 2.5rem | 2rem   | 1.5rem|
| h2       | 2.5rem  | 2rem   | 1.75rem| 1.3rem|
| h3       | 1.5rem  | 1.25rem| 1.15rem| 1.1rem|
| body     | 1rem    | 1rem   | 0.9rem | 0.9rem|

### 7. Espacamentos Mobile

```css
/* Container padding */
Desktop: var(--espacamento-xl)
Tablet:  var(--espacamento-md)
Mobile:  var(--espacamento-sm)

/* Card padding */
Desktop: var(--espacamento-lg)
Mobile:  var(--espacamento-md)

/* Gaps em grids */
Desktop: var(--espacamento-lg)
Mobile:  var(--espacamento-md) ou var(--espacamento-sm)
```

### 8. Landscape Mode

```css
@media (orientation: landscape) and (max-height: 500px) {
  - Sidebar: colapsada automaticamente
  - Hero: padding reduzido
  - Modals: max-height 90vh com scroll
}
```

## 🎨 CSS Custom Properties Mobile

```css
--vh: 1vh; /* Atualizado via JS para fix 100vh */
```

## 📂 Arquivos Modificados

### CSS
1. ✅ `global.css` - Base responsiva + utilities
2. ✅ `pages/landing.css` - Landing page mobile
3. ✅ `pages/dashboard.css` - Dashboard cliente mobile
4. ✅ `pages/admin.css` - Admin panel mobile

### JavaScript
1. ✅ `mobile-menu.js` - Controle do menu mobile
2. ✅ `mobile-enhancements.js` - Otimizações gerais

## 🔍 Componentes com Scroll Horizontal

Quando a tela é muito pequena, estes componentes usam scroll horizontal:

- ✅ Tables (data-table, invoices-table, admin-table)
- ✅ Filter tabs
- ✅ Settings sidebar (vira horizontal)
- ✅ Heatmap grid (reduzido para 4-6 colunas)

## ✨ Features Especiais

### 1. Menu Mobile
- Botão aparece automaticamente < 968px
- Ícone muda de menu para X ao abrir
- Overlay com fade
- Fecha ao clicar fora
- Fecha ao clicar em qualquer link
- Previne scroll do body quando aberto

### 2. Viewport Height Fix
JavaScript detecta altura real do viewport (excluindo barras de navegação) e define custom property `--vh`.

```css
/* Usar assim */
height: calc(var(--vh, 1vh) * 100);
```

### 3. Touch Feedback
Todos os elementos interativos têm opacity reduzido ao tocar (touchstart).

### 4. Platform Detection
Classes adicionadas ao body:
- `.mobile` - Qualquer dispositivo móvel
- `.ios` - iPhone/iPad
- `.android` - Android
- `.portrait` / `.landscape` - Orientação

### 5. Offline Indicator
Barra vermelha no topo quando sem conexão.

## 📊 Testing Checklist

### Dispositivos Testados
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Samsung Galaxy S20 (360px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)

### Orientações
- [ ] Portrait
- [ ] Landscape
- [ ] Landscape com teclado virtual

### Browsers Mobile
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Firefox Mobile
- [ ] Samsung Internet

## 🚀 Como Usar

### Incluir nos HTMLs

```html
<!-- CSS -->
<link rel="stylesheet" href="../assets/css/global.css">
<link rel="stylesheet" href="../assets/css/pages/dashboard.css">

<!-- JavaScript (antes do </body>) -->
<script src="../assets/js/mobile-menu.js"></script>
<script src="../assets/js/mobile-enhancements.js"></script>
```

### Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
<meta name="theme-color" content="#0a3622">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

## 🎯 Próximos Passos

- [ ] Adicionar service worker para PWA
- [ ] Implementar pull-to-refresh
- [ ] Adicionar gestos de swipe
- [ ] Otimizar imagens com srcset
- [ ] Implementar dark mode toggle
- [ ] Adicionar haptic feedback (vibração)

## 📱 PWA Considerations

Para transformar em PWA:
1. Adicionar `manifest.json`
2. Implementar service worker
3. Configurar ícones (192x192, 512x512)
4. Adicionar splash screens

## 🐛 Known Issues

1. **iOS Safari**: 100vh inclui barra de navegação
   - ✅ RESOLVIDO: usando custom property --vh

2. **Android Chrome**: Input zoom ao focar
   - ✅ RESOLVIDO: font-size: 16px nos inputs

3. **Landscape mobile**: Conteúdo muito comprimido
   - ✅ RESOLVIDO: ajustes específicos de altura

## 📝 Notas Importantes

1. **Font-size mínimo 16px**: Previne zoom automático no iOS
2. **Touch targets mínimo 44x44px**: Apple guidelines
3. **Overflow scroll**: Sempre com `-webkit-overflow-scrolling: touch`
4. **Tabelas**: Preferir cards em mobile ao invés de tabelas
5. **Modais**: Full screen em telas < 480px

## 🎨 Design Tokens Mobile

```css
/* Spacing */
--espacamento-xs: 4px;   /* Gaps pequenos */
--espacamento-sm: 8px;   /* Padding mobile */
--espacamento-md: 12px;  /* Padding tablet */
--espacamento-lg: 16px;  /* Padding desktop */
--espacamento-xl: 24px;
--espacamento-2xl: 32px;

/* Border radius */
--radius-sm: 6px;   /* Mobile */
--radius-md: 8px;   /* Padrão */
--radius-lg: 12px;  /* Cards */
--radius-xl: 16px;

/* Font sizes mobile */
--font-xs: 0.75rem;  /* 12px */
--font-sm: 0.875rem; /* 14px */
--font-md: 1rem;     /* 16px - Base mobile */
--font-lg: 1.125rem; /* 18px */
```

---

**Última atualização**: 12 de fevereiro de 2026
**Versão**: 2.0
**Autor**: Midiah Development Team
