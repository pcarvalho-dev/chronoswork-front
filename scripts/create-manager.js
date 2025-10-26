#!/usr/bin/env node

/**
 * Script para criar o primeiro gestor do sistema
 * Uso: node scripts/create-manager.js
 */

import bcrypt from 'bcrypt';
import { AppDataSource } from '../src/database/data-source.js';
import { User } from '../src/models/User.js';

async function createManager() {
  try {
    console.log('🚀 Inicializando conexão com o banco de dados...');
    
    // Inicializar conexão
    await AppDataSource.initialize();
    console.log('✅ Conexão com banco de dados estabelecida');

    // Verificar se já existe um gestor
    const existingManager = await AppDataSource.getRepository(User).findOne({
      where: { role: 'manager' }
    });

    if (existingManager) {
      console.log('⚠️  Já existe um gestor no sistema:', existingManager.email);
      console.log('   Se você deseja criar outro gestor, use a interface web.');
      process.exit(0);
    }

    // Dados do gestor inicial
    const managerData = {
      name: 'Administrador do Sistema',
      email: 'admin@chronos.work',
      password: 'admin123', // Senha padrão - deve ser alterada no primeiro login
      role: 'manager',
      cpf: '000.000.000-00',
      phone: '(00) 00000-0000',
      department: 'Administração',
      position: 'Administrador',
      employeeId: 'ADM001',
      hireDate: new Date(),
      isActive: true,
    };

    console.log('🔐 Criptografando senha...');
    const hashedPassword = await bcrypt.hash(managerData.password, 10);

    console.log('👤 Criando gestor inicial...');
    const manager = AppDataSource.getRepository(User).create({
      ...managerData,
      password: hashedPassword,
    });

    await AppDataSource.getRepository(User).save(manager);

    console.log('✅ Gestor criado com sucesso!');
    console.log('📧 Email:', managerData.email);
    console.log('🔑 Senha:', managerData.password);
    console.log('');
    console.log('⚠️  IMPORTANTE:');
    console.log('   1. Faça login com as credenciais acima');
    console.log('   2. Altere a senha padrão imediatamente');
    console.log('   3. Complete seu perfil com informações reais');
    console.log('   4. Crie outros gestores conforme necessário');
    console.log('');
    console.log('🌐 Acesse: http://localhost:3000/manager');

  } catch (error) {
    console.error('❌ Erro ao criar gestor:', error.message);
    process.exit(1);
  } finally {
    // Fechar conexão
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Conexão com banco de dados fechada');
    }
  }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createManager();
}

export { createManager };