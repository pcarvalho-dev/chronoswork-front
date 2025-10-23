# Guia Rápido - Chronos.work Frontend

## 🚀 Como Rodar

### 1. Backend (Terminal 1)
```bash
cd C:\Users\pablo\Projetos\Chronos.work\chronos_work
npm start
```
✅ Backend rodando em: http://localhost:8000

### 2. Frontend (Terminal 2)
```bash
cd C:\Users\pablo\Projetos\Chronos.work\chronos_work_frontend
npm run dev
```
✅ Frontend rodando em: http://localhost:3000

## 📋 Fluxo de Teste

1. **Acesse a Landing Page**
   - Abra http://localhost:3000
   - Veja a página inicial com features

2. **Crie uma Conta**
   - Clique em "Get Started" ou navegue para http://localhost:3000/register
   - Preencha: Nome, Email, Senha
   - Clique em "Create account"

3. **Faça Login** (se já tiver conta)
   - Navegue para http://localhost:3000/login
   - Insira Email e Senha
   - Clique em "Sign in"

4. **Use o Dashboard**
   - Após login, você será redirecionado para http://localhost:3000/dashboard
   - **Check-In**: Clique no botão "Check In" para iniciar uma sessão
   - **Sessão Ativa**: Veja o tempo decorrendo em tempo real
   - **Check-Out**: Clique em "Check Out" para finalizar a sessão
   - **Histórico**: Veja todas as suas sessões anteriores com duração

## 🛠️ Resolução de Problemas

### Erro de Turbopack
Se aparecer erro do Turbopack, o script já está configurado para usar `--turbo false`.

### Erro de Conexão com a API
Verifique se:
- O backend está rodando em http://localhost:8000
- O arquivo `.env.local` existe com: `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Erro de CORS
Certifique-se de que o backend tem CORS configurado para aceitar requisições do frontend.

## 📦 Estrutura das Páginas

```
/                    → Landing Page (pública)
/login              → Login (pública)
/register           → Cadastro (pública)
/dashboard          → Dashboard (requer autenticação)
```

## 🔑 Variáveis de Ambiente

Arquivo `.env.local` (já criado):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 Documentação da API

Acesse a documentação interativa da API em:
http://localhost:8000/docs

## ✨ Features Implementadas

- ✅ Landing Page responsiva
- ✅ Sistema de autenticação (login/register)
- ✅ Dashboard com check-in/check-out
- ✅ Histórico de sessões
- ✅ Cálculo de duração em tempo real
- ✅ Indicador de sessão ativa
- ✅ Design moderno com Tailwind CSS
- ✅ Integração completa com a API

## 🎨 Design System

### Cores Principais
- **Primary**: Azul (#3b82f6)
- **Warm Grey**: Cinza neutro

### Componentes Customizados
- Botões: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Cards: `.card`
- Inputs: `.input`
- Labels: `.label`

Divirta-se testando! 🎉
