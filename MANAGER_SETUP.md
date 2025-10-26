# 🚀 Setup de Gestor - Chronos.work

Este guia explica como configurar o primeiro gestor no sistema Chronos.work.

## 📋 Pré-requisitos

- Backend rodando (http://localhost:8000)
- Banco de dados PostgreSQL configurado
- Migrações executadas

## 🎯 Métodos para Criar o Primeiro Gestor

### **Método 1: Script Automático (Recomendado)**

Execute o script que cria automaticamente um gestor inicial:

```bash
# No diretório do frontend
npm run create-manager
```

**Credenciais padrão:**
- **Email:** admin@chronos.work
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere a senha padrão no primeiro login!

### **Método 2: Interface Web**

1. Acesse: http://localhost:3000/manager/register
2. Preencha o formulário de registro de gestor
3. Aguarde a aprovação (se necessário)

### **Método 3: Backend Direto**

Se você tem acesso direto ao banco de dados:

```sql
-- Inserir gestor diretamente no banco
INSERT INTO "user" (
  name, email, password, role, "isActive", 
  "createdAt", "updatedAt"
) VALUES (
  'Administrador', 
  'admin@chronos.work', 
  '$2b$10$...', -- Senha criptografada
  'manager', 
  true, 
  NOW(), 
  NOW()
);
```

## 🔧 Configuração Inicial

### **1. Primeiro Login**

1. Acesse: http://localhost:3000/manager
2. Faça login com as credenciais do gestor
3. **Altere a senha padrão imediatamente**

### **2. Configuração do Perfil**

1. Complete seu perfil com informações reais
2. Adicione foto de perfil
3. Configure informações da empresa

### **3. Criar Outros Gestores**

1. Acesse: **Usuários** → **Novo Usuário**
2. Selecione **Função: Gestor**
3. Preencha as informações necessárias

## 🛡️ Segurança

### **Boas Práticas:**

- ✅ Use senhas fortes (mínimo 8 caracteres)
- ✅ Altere senhas padrão imediatamente
- ✅ Configure 2FA se disponível
- ✅ Monitore logs de acesso
- ✅ Faça backup regular dos dados

### **Controle de Acesso:**

- Apenas gestores podem criar outros gestores
- Funcionários são redirecionados para `/dashboard`
- Gestores são redirecionados para `/manager`

## 🔄 Fluxo de Trabalho

### **Para Gestores:**
1. **Dashboard** → Visão geral do sistema
2. **Usuários** → Gerenciar funcionários
3. **Pontos** → Relatórios e aprovações
4. **Aprovações** → Aprovar lançamentos manuais

### **Para Funcionários:**
1. **Dashboard** → Registrar entrada/saída
2. **Histórico** → Ver seus pontos
3. **Perfil** → Atualizar informações

## 🚨 Solução de Problemas

### **Erro: "Nenhum gestor encontrado"**
```bash
# Execute o script de criação
npm run create-manager
```

### **Erro: "Acesso negado"**
- Verifique se o usuário tem role 'manager'
- Confirme se está logado corretamente

### **Erro: "Banco de dados não conectado"**
```bash
# Verifique se o backend está rodando
curl http://localhost:8000/health

# Execute as migrações
npm run migration:run
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend
2. Confirme a conexão com o banco
3. Execute as migrações
4. Consulte a documentação da API: http://localhost:8000/docs

---

**🎉 Pronto!** Seu sistema Chronos.work está configurado e pronto para uso!