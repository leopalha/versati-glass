# 🎨 VERSATI GLASS - DESIGN SYSTEM

## VISÃO GERAL

Sistema de design para a plataforma Versati Glass, baseado em uma estética **Luxury Minimal** com tema escuro (preto profundo) e acentos dourados. O design reflete a natureza do produto (vidro): transparência, luz, reflexos e elegância.

**Filosofia:** "Menos é mais, mas com requinte"

---

## 1. CORES

### 1.1 Paleta Primária

```typescript
// tailwind.config.ts
const colors = {
  versati: {
    black: '#0A0A0A',      // Background principal
    gold: '#C9A962',       // Accent principal
    bronze: '#B8956E',     // Accent secundário
    copper: '#8B7355',     // Accent terciário
    white: '#FFFFFF',      // Texto principal
  }
}
```

### 1.2 Escala de Dourado

```typescript
gold: {
  50:  '#FDF9F0',
  100: '#F9F0DB',
  200: '#F2E1B8',
  300: '#E8CD8A',
  400: '#D9B86A',
  500: '#C9A962',  // PRINCIPAL
  600: '#B8956E',
  700: '#8B7355',
  800: '#5E4D3A',
  900: '#3D3226',
  950: '#1F1A14',
}
```

### 1.3 Escala de Neutros (Dark Theme)

```typescript
neutral: {
  0:   '#000000',  // Preto absoluto
  50:  '#0A0A0A',  // Background principal
  100: '#111111',  // Surface
  150: '#141414',  // Cards
  200: '#1A1A1A',  // Hover
  250: '#1F1F1F',  // Inputs
  300: '#262626',  // Borders
  400: '#404040',  // Disabled
  500: '#666666',  // Muted text
  600: '#808080',  // Placeholder
  700: '#A1A1A1',  // Secondary text
  800: '#C4C4C4',  // Tertiary text
  900: '#E5E5E5',  // Light text
  950: '#F5F5F5',  // Near white
  1000: '#FFFFFF', // White
}
```

### 1.4 Cores Semânticas

```typescript
semantic: {
  success: {
    light: '#34D399',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FBBF24',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#F87171',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#60A5FA',
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
  }
}
```

### 1.5 Gradientes

```css
/* Gradiente Principal (Dourado) */
.gradient-gold {
  background: linear-gradient(135deg, #C9A962 0%, #B8956E 50%, #8B7355 100%);
}

/* Gradiente Horizontal */
.gradient-gold-horizontal {
  background: linear-gradient(90deg, #C9A962 0%, #B8956E 100%);
}

/* Gradiente para Texto */
.text-gradient-gold {
  background: linear-gradient(135deg, #C9A962 0%, #F2E1B8 50%, #C9A962 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gradiente Sutil (Backgrounds) */
.gradient-gold-subtle {
  background: linear-gradient(180deg, rgba(201, 169, 98, 0.05) 0%, rgba(201, 169, 98, 0.02) 100%);
}

/* Gradiente de Card Premium */
.gradient-card-premium {
  background: linear-gradient(145deg, #141414 0%, #0A0A0A 100%);
}

/* Glassmorphism */
.glass {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(201, 169, 98, 0.1);
}
```

---

## 2. TIPOGRAFIA

### 2.1 Fontes

```typescript
// fonts.ts
import { Cormorant_Garamond, Inter, Outfit } from 'next/font/google'

export const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
```

### 2.2 Configuração Tailwind

```typescript
fontFamily: {
  display: ['var(--font-cormorant)', 'Georgia', 'serif'],
  heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
  body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
}
```

### 2.3 Escala Tipográfica

| Token | Desktop | Mobile | Line Height | Letter Spacing | Uso |
|-------|---------|--------|-------------|----------------|-----|
| `display` | 72px | 48px | 1.1 | -0.02em | Hero principal |
| `h1` | 48px | 36px | 1.2 | -0.01em | Títulos de página |
| `h2` | 36px | 28px | 1.25 | -0.01em | Seções principais |
| `h3` | 24px | 20px | 1.3 | 0 | Subtítulos |
| `h4` | 20px | 18px | 1.4 | 0 | Títulos de card |
| `h5` | 18px | 16px | 1.4 | 0 | Títulos menores |
| `body-lg` | 18px | 16px | 1.6 | 0 | Texto destacado |
| `body` | 16px | 14px | 1.6 | 0 | Texto padrão |
| `body-sm` | 14px | 13px | 1.5 | 0 | Texto auxiliar |
| `caption` | 12px | 11px | 1.4 | 0.01em | Labels, hints |
| `overline` | 12px | 11px | 1.4 | 0.1em | Categorias, tags |

### 2.4 Classes Utilitárias

```css
/* Display - Cormorant */
.text-display {
  @apply font-display text-5xl md:text-7xl font-semibold tracking-tight leading-tight;
}

/* Headings - Outfit */
.text-h1 { @apply font-heading text-3xl md:text-5xl font-bold tracking-tight; }
.text-h2 { @apply font-heading text-2xl md:text-4xl font-semibold; }
.text-h3 { @apply font-heading text-xl md:text-2xl font-semibold; }
.text-h4 { @apply font-heading text-lg md:text-xl font-medium; }

/* Body - Inter */
.text-body-lg { @apply font-body text-base md:text-lg; }
.text-body { @apply font-body text-sm md:text-base; }
.text-body-sm { @apply font-body text-xs md:text-sm; }

/* Overline */
.text-overline {
  @apply font-body text-xs uppercase tracking-widest font-medium text-gold-500;
}
```

---

## 3. ESPAÇAMENTO

### 3.1 Escala Base (4px)

```typescript
spacing: {
  px: '1px',
  0: '0',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
}
```

### 3.2 Tokens Semânticos

```css
/* Containers */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1440px;

/* Page Padding */
--space-page-x: 16px;      /* Mobile */
--space-page-x-md: 24px;   /* Tablet */
--space-page-x-lg: 32px;   /* Desktop */
--space-page-x-xl: 48px;   /* Large Desktop */

/* Sections */
--space-section-y: 64px;   /* Mobile */
--space-section-y-md: 96px;  /* Tablet */
--space-section-y-lg: 128px; /* Desktop */

/* Cards */
--space-card: 24px;        /* Padding interno */
--space-card-sm: 16px;     /* Cards menores */
--space-card-lg: 32px;     /* Cards maiores */

/* Stack (vertical) */
--space-stack-xs: 4px;
--space-stack-sm: 8px;
--space-stack-md: 16px;
--space-stack-lg: 24px;
--space-stack-xl: 32px;

/* Inline (horizontal) */
--space-inline-xs: 4px;
--space-inline-sm: 8px;
--space-inline-md: 12px;
--space-inline-lg: 16px;
```

---

## 4. BORDAS E RAIOS

### 4.1 Border Radius

```typescript
borderRadius: {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
}
```

### 4.2 Uso Recomendado

| Elemento | Radius | Token |
|----------|--------|-------|
| Botões pequenos | 8px | `rounded` |
| Botões padrão | 12px | `rounded-md` |
| Inputs | 12px | `rounded-md` |
| Cards | 16px | `rounded-lg` |
| Cards grandes | 24px | `rounded-2xl` |
| Modais | 24px | `rounded-2xl` |
| Avatares | 9999px | `rounded-full` |
| Badges | 9999px | `rounded-full` |

### 4.3 Borders

```typescript
borderWidth: {
  0: '0',
  DEFAULT: '1px',
  2: '2px',
}

borderColor: {
  DEFAULT: '#262626',
  gold: '#C9A962',
  subtle: '#1A1A1A',
}
```

---

## 5. SOMBRAS E EFEITOS

### 5.1 Box Shadows

```typescript
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  'DEFAULT': '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
  'md': '0 4px 8px -1px rgba(0, 0, 0, 0.4)',
  'lg': '0 8px 16px -2px rgba(0, 0, 0, 0.4)',
  'xl': '0 16px 32px -4px rgba(0, 0, 0, 0.4)',
  '2xl': '0 24px 48px -8px rgba(0, 0, 0, 0.5)',
  
  // Glows da marca
  'glow-gold': '0 0 20px rgba(201, 169, 98, 0.2)',
  'glow-gold-md': '0 0 30px rgba(201, 169, 98, 0.3)',
  'glow-gold-lg': '0 0 40px rgba(201, 169, 98, 0.4)',
  
  // Cards
  'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
  'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 169, 98, 0.1)',
  'card-elevated': '0 12px 40px rgba(0, 0, 0, 0.5)',
  
  // Inner shadows
  'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
}
```

### 5.2 Backdrop Blur

```typescript
backdropBlur: {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
}
```

---

## 6. ANIMAÇÕES

### 6.1 Transições

```typescript
transitionDuration: {
  fast: '150ms',
  DEFAULT: '200ms',
  medium: '300ms',
  slow: '500ms',
  slower: '700ms',
}

transitionTimingFunction: {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
}
```

### 6.2 Keyframes

```typescript
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeInUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInDown: {
    '0%': { opacity: '0', transform: 'translateY(-20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slideInRight: {
    '0%': { opacity: '0', transform: 'translateX(20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  slideInLeft: {
    '0%': { opacity: '0', transform: 'translateX(-20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  scaleIn: {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  glow: {
    '0%, 100%': { boxShadow: '0 0 20px rgba(201, 169, 98, 0.2)' },
    '50%': { boxShadow: '0 0 30px rgba(201, 169, 98, 0.4)' },
  },
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

animation: {
  'fade-in': 'fadeIn 0.3s ease-out',
  'fade-in-up': 'fadeInUp 0.4s ease-out',
  'fade-in-down': 'fadeInDown 0.4s ease-out',
  'slide-in-right': 'slideInRight 0.4s ease-out',
  'slide-in-left': 'slideInLeft 0.4s ease-out',
  'scale-in': 'scaleIn 0.2s ease-out',
  'shimmer': 'shimmer 2s infinite linear',
  'pulse': 'pulse 2s infinite',
  'glow': 'glow 2s infinite',
  'spin': 'spin 1s linear infinite',
}
```

### 6.3 Framer Motion Variants

```typescript
// Fade In Up (padrão para elementos)
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
}

// Stagger Container
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

// Stagger Item
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Scale on Hover
export const scaleHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
}

// Page Transition
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

// Modal Overlay
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Modal Content
export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
}
```

---

## 7. COMPONENTES BASE

### 7.1 Botões

```css
/* Primário (Dourado sólido) */
.btn-primary {
  @apply bg-gold-500 text-neutral-0 font-medium px-6 py-3 rounded-md
         transition-all duration-200
         hover:bg-gold-600 hover:shadow-glow-gold
         active:scale-[0.98]
         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold-500;
}

/* Secundário (Outline dourado) */
.btn-secondary {
  @apply border-2 border-gold-500 text-gold-500
         bg-transparent px-6 py-3 rounded-md font-medium
         transition-all duration-200
         hover:bg-gold-500/10 hover:shadow-glow-gold;
}

/* Ghost */
.btn-ghost {
  @apply text-white/80 px-4 py-2 rounded-md
         transition-all duration-200
         hover:bg-white/5 hover:text-white;
}

/* Danger */
.btn-danger {
  @apply bg-error text-white font-medium px-6 py-3 rounded-md
         transition-all duration-200
         hover:bg-error-dark;
}

/* Tamanhos */
.btn-sm { @apply px-4 py-2 text-sm; }
.btn-md { @apply px-6 py-3 text-base; }
.btn-lg { @apply px-8 py-4 text-lg; }
```

### 7.2 Cards

```css
/* Card Padrão */
.card {
  @apply bg-neutral-150 rounded-xl border border-neutral-300
         transition-all duration-300;
}

/* Card com Hover */
.card-hover {
  @apply bg-neutral-150 rounded-xl border border-neutral-300
         transition-all duration-300
         hover:border-gold-500/30 hover:shadow-card-hover;
}

/* Card Premium */
.card-premium {
  @apply bg-gradient-to-br from-neutral-150 to-neutral-100
         rounded-2xl border border-gold-500/20
         shadow-card;
}

/* Card Glass */
.card-glass {
  @apply bg-neutral-150/80 backdrop-blur-lg
         rounded-xl border border-gold-500/10;
}
```

### 7.3 Inputs

```css
/* Input Padrão */
.input {
  @apply w-full bg-neutral-250 border border-neutral-300 
         rounded-md px-4 py-3 text-white
         placeholder:text-neutral-500
         transition-all duration-200
         focus:outline-none focus:border-gold-500 
         focus:ring-2 focus:ring-gold-500/20;
}

/* Input com Erro */
.input-error {
  @apply border-error focus:border-error focus:ring-error/20;
}

/* Input Disabled */
.input:disabled {
  @apply bg-neutral-300 text-neutral-500 cursor-not-allowed;
}

/* Label */
.label {
  @apply block text-sm font-medium text-neutral-700 mb-2;
}

/* Helper Text */
.helper-text {
  @apply text-sm text-neutral-500 mt-1;
}

/* Error Text */
.error-text {
  @apply text-sm text-error mt-1;
}
```

---

## 8. BREAKPOINTS

```typescript
screens: {
  'xs': '375px',   // Mobile pequeno
  'sm': '640px',   // Mobile grande
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop pequeno
  'xl': '1280px',  // Desktop
  '2xl': '1440px', // Desktop grande
  '3xl': '1920px', // Desktop extra grande
}
```

### Uso

```jsx
// Mobile first
<div className="
  px-4        // Mobile
  sm:px-6     // Mobile grande
  md:px-8     // Tablet
  lg:px-12    // Desktop
  xl:px-16    // Desktop grande
">

// Grid responsivo
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-6
">
```

---

## 9. Z-INDEX

```typescript
zIndex: {
  0: '0',
  10: '10',      // Elementos base elevados
  20: '20',      // Dropdowns, tooltips
  30: '30',      // Sticky headers
  40: '40',      // Sidebars
  50: '50',      // Overlays
  60: '60',      // Modais
  70: '70',      // Toasts/Notificações
  80: '80',      // Popups críticos
  100: '100',    // Máximo (loading screens)
}
```

---

## 10. ÍCONES

### Biblioteca: Lucide React

```bash
npm install lucide-react
```

### Tamanhos Padrão

| Contexto | Tamanho | Classes |
|----------|---------|---------|
| Inline (texto) | 16px | `w-4 h-4` |
| Botões | 20px | `w-5 h-5` |
| Cards | 24px | `w-6 h-6` |
| Features | 32px | `w-8 h-8` |
| Hero | 48px | `w-12 h-12` |

### Cor

```jsx
// Dourado (destaque)
<Icon className="w-5 h-5 text-gold-500" />

// Branco (padrão)
<Icon className="w-5 h-5 text-white" />

// Muted
<Icon className="w-5 h-5 text-neutral-500" />

// Semântico
<Check className="w-5 h-5 text-success" />
<AlertTriangle className="w-5 h-5 text-warning" />
<X className="w-5 h-5 text-error" />
```

---

## 11. IMAGENS

### Aspect Ratios

```typescript
aspectRatio: {
  'auto': 'auto',
  'square': '1 / 1',
  'video': '16 / 9',
  'photo': '4 / 3',
  'portrait': '3 / 4',
  'wide': '21 / 9',
}
```

### Object Fit

```jsx
// Hero images
<img className="w-full h-full object-cover" />

// Product images
<img className="w-full h-full object-contain" />

// Gallery
<img className="w-full aspect-square object-cover rounded-lg" />
```

### Overlay Padrão

```css
/* Overlay escuro para texto sobre imagem */
.image-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent;
}

/* Overlay completo */
.image-overlay-full {
  @apply absolute inset-0 bg-black/60;
}
```

---

## 12. ESTADOS

### Loading

```css
/* Skeleton */
.skeleton {
  @apply bg-neutral-200 animate-pulse rounded;
}

/* Shimmer */
.shimmer {
  @apply relative overflow-hidden;
  background: linear-gradient(90deg, #141414 0%, #1A1A1A 50%, #141414 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Empty State

```jsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <Icon className="w-12 h-12 text-neutral-400 mb-4" />
  <h3 className="text-lg font-medium text-white mb-2">Nenhum item encontrado</h3>
  <p className="text-neutral-500 mb-6">Descrição do estado vazio</p>
  <Button>Ação</Button>
</div>
```

### Error State

```jsx
<div className="bg-error/10 border border-error/20 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-medium text-error">Erro ao carregar</h4>
      <p className="text-sm text-error/80 mt-1">Descrição do erro</p>
    </div>
  </div>
</div>
```

---

## 13. ACESSIBILIDADE

### Foco

```css
/* Focus ring padrão */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-neutral-50;
}

/* Focus visible (apenas teclado) */
.focus-visible-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50;
}
```

### Contraste Mínimo

| Elemento | Foreground | Background | Ratio |
|----------|------------|------------|-------|
| Texto principal | #FFFFFF | #0A0A0A | 21:1 ✅ |
| Texto secundário | #A1A1A1 | #0A0A0A | 7.5:1 ✅ |
| Texto muted | #666666 | #0A0A0A | 4.5:1 ✅ |
| Dourado sobre preto | #C9A962 | #0A0A0A | 7.2:1 ✅ |
| Preto sobre dourado | #0A0A0A | #C9A962 | 7.2:1 ✅ |

### Screen Reader

```jsx
// Texto apenas para SR
<span className="sr-only">Descrição para leitores de tela</span>

// Ícone com label
<button aria-label="Fechar modal">
  <X className="w-5 h-5" />
</button>
```

---

## 14. CSS VARIABLES COMPLETAS

```css
:root {
  /* Cores */
  --color-gold-500: #C9A962;
  --color-gold-rgb: 201, 169, 98;
  
  /* Backgrounds */
  --bg-primary: #0A0A0A;
  --bg-surface: #111111;
  --bg-card: #141414;
  --bg-input: #1F1F1F;
  
  /* Texto */
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1A1;
  --text-muted: #666666;
  
  /* Bordas */
  --border-default: #262626;
  --border-gold: #C9A962;
  
  /* Espaçamento */
  --space-page-x: 16px;
  --space-section-y: 64px;
  --space-card: 24px;
  
  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Transições */
  --transition-fast: 150ms;
  --transition-default: 200ms;
  --transition-slow: 300ms;
  
  /* Sombras */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
  --glow-gold: 0 0 20px rgba(201, 169, 98, 0.2);
}

@media (min-width: 768px) {
  :root {
    --space-page-x: 24px;
    --space-section-y: 96px;
  }
}

@media (min-width: 1024px) {
  :root {
    --space-page-x: 32px;
    --space-section-y: 128px;
  }
}
```

---

## 15. BOAS PRÁTICAS

### Do's ✅

1. **Use CSS Variables** para cores e espaçamentos
2. **Mobile-first** - sempre começar pelo mobile
3. **Use componentes reutilizáveis** (Button, Input, Card)
4. **Mantenha consistência** nos espaçamentos (múltiplos de 4px)
5. **Use Framer Motion** para animações
6. **Garanta contraste adequado** (WCAG AA)
7. **Sempre inclua estados** (loading, error, empty, disabled)
8. **Dark mode é o padrão** - todo o sistema é dark-first

### Don'ts ❌

1. **Não hardcode cores** - use tokens
2. **Não crie novos padrões** sem necessidade
3. **Não use !important** exceto casos extremos
4. **Não ignore acessibilidade**
5. **Não use animações longas** (máx 500ms)
6. **Não misture unidades** (stick to rem/px)

---

*Versati Glass Design System v1.0 - Dezembro 2024*
