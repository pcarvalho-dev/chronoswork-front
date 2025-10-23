# 🎨 Migração para Tailwind CSS 4

## ✅ Mudança Aplicada!

O projeto agora usa **Tailwind CSS 4** com a nova sintaxe de configuração.

---

## 📋 O que mudou:

### Antes (Tailwind CSS 3):
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        warmGrey: {...}
      }
    }
  }
}
```

### Depois (Tailwind CSS 4):
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-warmgrey-50: #fafaf9;
  --color-warmgrey-100: #f5f5f4;
  /* ... */
}
```

---

## 🎯 Principais Mudanças:

### 1. **Configuração no CSS**
Agora as cores customizadas são definidas diretamente no `globals.css` usando o directive `@theme`.

### 2. **Sem tailwind.config.js**
O arquivo `tailwind.config.js` foi removido. Toda configuração agora está no CSS.

### 3. **Nova Sintaxe de Import**
```css
/* Antes */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Depois */
@import "tailwindcss";
```

### 4. **CSS Variables**
As cores customizadas usam CSS variables:
```css
@theme {
  --color-primary-600: #2563eb;
  --color-warmgrey-200: #e7e5e4;
}
```

---

## 🎨 Cores Disponíveis:

### Primary (Azul):
- `bg-primary-50` até `bg-primary-950`
- `text-primary-50` até `text-primary-950`
- `border-primary-50` até `border-primary-950`

### Warm Grey (Cinza):
- `bg-warmgrey-50` até `bg-warmgrey-950`
- `text-warmgrey-50` até `text-warmgrey-950`
- `border-warmgrey-50` até `border-warmgrey-950`

**Nota:** Apenas lowercase (`warmgrey`) funciona agora, não `warmGrey`.

---

## 📦 Dependências:

```json
{
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.15"
  },
  "devDependencies": {
    "tailwindcss": "^4.1.15",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.21"
  }
}
```

---

## 🔧 PostCSS Config:

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

---

## ✅ Classes Customizadas:

Todas as classes customizadas continuam funcionando:

```css
/* Botões */
.btn-primary
.btn-secondary
.btn-ghost

/* Layout */
.container-custom
.card

/* Forms */
.input
.label
```

---

## 🚀 Como Usar:

### Usar cores do tema:
```jsx
<div className="bg-primary-600 text-white">
  <p className="text-warmgrey-100">Hello</p>
</div>
```

### Usar classes customizadas:
```jsx
<button className="btn-primary">
  Click me
</button>

<div className="card">
  <input className="input" />
</div>
```

---

## 🐛 Troubleshooting:

### Erro: "Cannot apply unknown utility class"
Isso significa que o Tailwind não reconheceu a cor.

**Solução:**
1. Verifique se o nome está em lowercase: `warmgrey` (não `warmGrey`)
2. Limpe o cache: `rm -rf .next`
3. Reinicie o servidor: `npm run dev`

### Erro: "Cannot find module '@tailwindcss/postcss'"
```bash
npm install @tailwindcss/postcss tailwindcss postcss autoprefixer -D
```

---

## 📚 Recursos:

- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs/v4-beta)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [@theme Directive](https://tailwindcss.com/docs/theme)

---

**Última atualização:** 2025-10-22
**Tailwind CSS Versão:** 4.1.15
