# 🔧 Troubleshooting - Chronos.work Frontend

## Problemas Comuns e Soluções

### 🚨 Erro: "Port 3000 is in use" ou "Unable to acquire lock"

**Problema:** Outra instância do Next.js está rodando.

**Solução 1 - Matar o processo:**
```bash
# Windows
taskkill //F //PID [número_do_processo]

# Linux/Mac
kill -9 [número_do_processo]
```

**Solução 2 - Limpar cache e reiniciar:**
```bash
cd chronos_work_frontend
rm -rf .next
npm run dev
```

**Solução 3 - Usar outra porta:**
```bash
npm run dev -- -p 3001
```

---

### 🚨 Erro: "Cannot connect to API" / "Failed to fetch"

**Problema:** Backend não está rodando ou CORS não configurado.

**Verificações:**
1. ✅ Backend está rodando?
   ```bash
   cd chronos_work
   npm start
   # Deve mostrar: Server running on port 8000
   ```

2. ✅ `.env.local` existe e está correto?
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. ✅ Testar API diretamente:
   - Abra: http://localhost:8000/docs
   - Se não abrir, backend não está rodando!

**Solução - Configurar CORS no backend:**
O backend precisa aceitar requisições do frontend. Verifique se há configuração CORS adequada.

---

### 🚨 Erro: "Login não funciona" / "401 Unauthorized"

**Problema:** Credenciais inválidas ou sessão expirada.

**Soluções:**
1. **Criar nova conta:**
   - Acesse: http://localhost:3000/register
   - Cadastre-se com email único

2. **Limpar cookies:**
   - F12 → Application → Cookies
   - Deletar todos os cookies de localhost

3. **Verificar no backend:**
   - Teste o endpoint de login direto na API docs
   - http://localhost:8000/docs

---

### 🚨 Erro: "Page not found" / 404

**Problema:** Rota não existe ou build corrompido.

**Solução:**
```bash
# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências
npm install

# Reiniciar servidor
npm run dev
```

---

### 🚨 Erro: Turbopack crash / FATAL error

**Problema:** Bug conhecido do Turbopack no Windows.

**Solução:** O projeto já está configurado para usar Webpack ao invés de Turbopack.

Verifique se o `package.json` tem:
```json
"dev": "next dev --turbo false"
```

Se não tiver, rode:
```bash
npm run dev -- --turbo false
```

---

### 🚨 Erro: "Module not found" / Import errors

**Problema:** Dependência faltando ou caminho incorreto.

**Solução:**
```bash
# Reinstalar todas as dependências
rm -rf node_modules package-lock.json
npm install

# Verificar se todos os imports usam caminhos corretos
# Next.js usa @/ como alias para a raiz do projeto
```

---

### 🚨 Erro: Estilos não aparecem / Tailwind não funciona

**Problema:** Tailwind não está compilando corretamente.

**Solução:**
```bash
# Verificar se globals.css está importado em layout.tsx
# Deve ter:
import './globals.css'

# Limpar cache e rebuild
rm -rf .next
npm run dev
```

---

### 🚨 Erro: "Database connection failed" no backend

**Problema:** PostgreSQL não está rodando ou configuração errada.

**Solução:**
```bash
# Iniciar PostgreSQL com Docker
cd chronos_work
docker-compose up -d

# Verificar se subiu
docker ps

# Verificar .env do backend
# Deve ter DB_HOST, DB_PORT, DB_USERNAME, etc.
```

---

### 🚨 Problema: Dashboard vazio / Sem histórico

**Possíveis causas:**
1. **Não fez check-in ainda**
   - Solução: Clique em "Check In" para criar primeira sessão

2. **Sessão expirou**
   - Solução: Faça logout e login novamente

3. **API retornou erro**
   - Solução: Abra F12 → Console e veja os erros
   - Verifique também F12 → Network para ver requisições

---

### 🚨 Problema: Duração não atualiza em tempo real

**Isso é esperado!** A duração só atualiza quando você:
1. Recarrega a página
2. Faz check-out
3. Navega para outra página e volta

**Para ter atualização em tempo real:**
Seria necessário adicionar um `setInterval` no componente (feature futura).

---

### 🧹 Limpeza Completa (quando tudo mais falhar)

```bash
# Frontend
cd chronos_work_frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Backend
cd ../chronos_work
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### 📝 Verificar Logs

**Frontend (Next.js):**
- Console do navegador (F12)
- Terminal onde rodou `npm run dev`

**Backend (Node.js):**
- Terminal onde rodou `npm start`

**Banco de Dados:**
```bash
docker logs [container_id]
# ou
docker-compose logs postgres
```

---

### 🆘 Ainda com problemas?

1. **Verifique as versões:**
   ```bash
   node --version  # Deve ser 18+
   npm --version   # Deve ser 9+
   ```

2. **Teste cada parte separadamente:**
   - Backend API: http://localhost:8000/docs
   - Frontend: http://localhost:3000
   - Database: Teste conexão com psql ou DBeaver

3. **Leia os logs com atenção:**
   - Erros geralmente indicam exatamente o problema
   - Procure por "Error:", "ECONNREFUSED", "404", etc.

---

### 💡 Dicas de Debug

1. **Use o console do navegador (F12):**
   - Tab "Console" para erros JavaScript
   - Tab "Network" para ver requisições à API
   - Tab "Application" para ver cookies/session

2. **Teste a API diretamente:**
   - Use a documentação interativa em /docs
   - Use Postman ou Insomnia
   - Use curl no terminal

3. **Verifique variáveis de ambiente:**
   ```bash
   # Frontend - deve mostrar a URL da API
   cat .env.local

   # Backend - deve ter todas as configs do DB
   cat .env
   ```

---

**Se nada disso resolver, revise o START_HERE.md e README.md!**
