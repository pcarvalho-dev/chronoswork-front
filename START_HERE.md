# 🚀 COMECE AQUI - Chronos.work Frontend

## ✅ Migração Vite → Next.js Concluída!
## ✅ Todas as Dependências Instaladas!

O frontend foi **completamente migrado** de Vite para **Next.js 16** e está **totalmente integrado** com o backend!

---

## 📋 Para Rodar a Aplicação:

### Passo 1: Iniciar o Backend
```bash
# Em um terminal
cd C:\Users\pablo\Projetos\Chronos.work\chronos_work
npm start
```
✅ Backend: http://localhost:8000
✅ API Docs: http://localhost:8000/docs

### Passo 2: Iniciar o Frontend
```bash
# Em OUTRO terminal
cd C:\Users\pablo\Projetos\Chronos.work\chronos_work_frontend
npm run dev
```
✅ Frontend: http://localhost:3000

---

## 🎯 Teste o Sistema:

1. **Acesse** http://localhost:3000
2. **Clique em "Get Started"** → Cria uma conta
3. **Preencha**: Nome, Email, Senha
4. **Você será redirecionado** para o Dashboard
5. **Clique em "Check In"** → Inicia uma sessão de trabalho
6. **Veja o tempo** rodando em tempo real
7. **Clique em "Check Out"** → Finaliza a sessão
8. **Veja o histórico** de todas as suas sessões

---

## 📂 Estrutura do Projeto:

```
chronos_work_frontend/
├── app/
│   ├── components/          # Componentes React
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── api.ts          # Cliente da API
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard (check-in/out)
│   ├── login/
│   │   └── page.tsx        # Login
│   ├── register/
│   │   └── page.tsx        # Cadastro
│   ├── page.tsx            # Landing Page
│   ├── layout.tsx          # Layout raiz
│   └── globals.css         # Estilos globais
├── .env.local              # Variáveis de ambiente
├── next.config.ts          # Configuração Next.js
├── tailwind.config.js      # Configuração Tailwind
└── package.json            # Dependências
```

---

## 🌐 Páginas Disponíveis:

| URL | Descrição | Status |
|-----|-----------|--------|
| http://localhost:3000/ | Landing Page | ✅ Público |
| http://localhost:3000/login | Login | ✅ Público |
| http://localhost:3000/register | Cadastro | ✅ Público |
| http://localhost:3000/dashboard | Dashboard | 🔒 Requer Login |

---

## 🛠️ Tecnologias:

- **Next.js 16** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Fetch API** - Integração com backend

---

## 📚 Documentação:

- **QUICKSTART.md** - Guia rápido de uso
- **README.md** - Documentação completa
- **MIGRATION_SUMMARY.md** - Detalhes da migração

---

## 🎨 Features Implementadas:

✅ Landing page moderna e responsiva
✅ Sistema de autenticação (login/register)
✅ Dashboard interativo
✅ Check-in/Check-out em tempo real
✅ Indicador de sessão ativa
✅ Histórico de time logs
✅ Cálculo automático de duração
✅ Design system customizado
✅ Integração completa com API

---

## 💡 Comandos Úteis:

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar produção
npm start

# Linter
npm run lint

# Limpar cache Next.js
rm -rf .next
```

---

## ⚠️ Importante:

1. **Sempre rode o backend ANTES do frontend**
2. **Verifique se o arquivo `.env.local` existe**
3. **Use portas diferentes**: Backend (8000) e Frontend (3000)
4. **CORS**: O backend deve aceitar requisições de http://localhost:3000

---

## 🐛 Problemas Comuns:

### "Cannot connect to API"
- ✅ Backend está rodando?
- ✅ `.env.local` configurado?

### "Login não funciona"
- ✅ Conta criada corretamente?
- ✅ Email/senha corretos?

### "Página em branco"
- ✅ Verifique o console do navegador (F12)
- ✅ Limpe o cache: `rm -rf .next && npm run dev`

---

## 🎉 Está Tudo Pronto!

Execute os comandos acima e comece a usar o Chronos.work!

Boa sorte! 🚀
