'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';

export default function ManagerRegisterPage() {
  const router = useRouter();
  const { registerManager } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'manager' | 'company'>('manager');
  
  // Manager data
  const [managerData, setManagerData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    rg: '',
    birthDate: '',
    gender: '' as 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar' | '',
    maritalStatus: '' as 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'União Estável' | '',
    phone: '',
    mobilePhone: '',
    address: '',
    addressNumber: '',
    addressComplement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    bankName: '',
    bankAccount: '',
    bankAgency: '',
    bankAccountType: '' as 'Corrente' | 'Poupança' | 'Salário' | '',
    pix: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    education: '' as 'Fundamental' | 'Médio' | 'Superior' | 'Pós-graduação' | 'Mestrado' | 'Doutorado' | '',
    notes: '',
  });

  // Company data
  const [companyData, setCompanyData] = useState({
    name: '',
    cnpj: '',
    corporateName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    addressNumber: '',
    addressComplement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    description: '',
  });

  // Formatting functions
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
  };

  const formatMobilePhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleManagerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply formatting based on field type
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'mobilePhone') {
      formattedValue = formatMobilePhone(value);
    } else if (name === 'zipCode') {
      formattedValue = formatCEP(value);
    }

    setManagerData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply formatting based on field type
    if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'zipCode') {
      formattedValue = formatCEP(value);
    }

    setCompanyData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (managerData.password !== managerData.confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (managerData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (managerData.name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!companyData.name || companyData.name.length < 2) {
      setError('O nome da empresa é obrigatório');
      return;
    }

    if (!companyData.cnpj || companyData.cnpj.replace(/\D/g, '').length !== 14) {
      setError('CNPJ deve conter 14 dígitos');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const requestData = {
        name: managerData.name,
        email: managerData.email,
        password: managerData.password,
        company: {
          name: companyData.name,
          cnpj: companyData.cnpj.replace(/\D/g, ''),
          corporateName: companyData.corporateName || undefined,
          email: companyData.email || undefined,
          phone: companyData.phone || undefined,
          website: companyData.website || undefined,
          address: companyData.address || undefined,
          addressNumber: companyData.addressNumber || undefined,
          addressComplement: companyData.addressComplement || undefined,
          neighborhood: companyData.neighborhood || undefined,
          city: companyData.city || undefined,
          state: companyData.state || undefined,
          zipCode: companyData.zipCode.replace(/\D/g, '') || undefined,
          country: companyData.country,
          description: companyData.description || undefined,
        },
        // Add optional manager fields
        ...(managerData.cpf && { cpf: managerData.cpf.replace(/\D/g, '') }),
        ...(managerData.rg && { rg: managerData.rg }),
        ...(managerData.birthDate && { birthDate: managerData.birthDate }),
        ...(managerData.gender && { gender: managerData.gender }),
        ...(managerData.maritalStatus && { maritalStatus: managerData.maritalStatus }),
        ...(managerData.phone && { phone: managerData.phone }),
        ...(managerData.mobilePhone && { mobilePhone: managerData.mobilePhone }),
        ...(managerData.address && { address: managerData.address }),
        ...(managerData.addressNumber && { addressNumber: managerData.addressNumber }),
        ...(managerData.addressComplement && { addressComplement: managerData.addressComplement }),
        ...(managerData.neighborhood && { neighborhood: managerData.neighborhood }),
        ...(managerData.city && { city: managerData.city }),
        ...(managerData.state && { state: managerData.state }),
        ...(managerData.zipCode && { zipCode: managerData.zipCode.replace(/\D/g, '') }),
        ...(managerData.country && { country: managerData.country }),
        ...(managerData.bankName && { bankName: managerData.bankName }),
        ...(managerData.bankAccount && { bankAccount: managerData.bankAccount }),
        ...(managerData.bankAgency && { bankAgency: managerData.bankAgency }),
        ...(managerData.bankAccountType && { bankAccountType: managerData.bankAccountType }),
        ...(managerData.pix && { pix: managerData.pix }),
        ...(managerData.emergencyContactName && { emergencyContactName: managerData.emergencyContactName }),
        ...(managerData.emergencyContactPhone && { emergencyContactPhone: managerData.emergencyContactPhone }),
        ...(managerData.emergencyContactRelationship && { emergencyContactRelationship: managerData.emergencyContactRelationship }),
        ...(managerData.education && { education: managerData.education }),
        ...(managerData.notes && { notes: managerData.notes }),
      };

      await registerManager(requestData);
      setSuccess(true);
      
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative">
        <InteractiveBackground />
        
        <div className="container-custom py-12 relative z-10">
          <div className="max-w-md mx-auto text-center">
            <div className="glass-container p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-warmGrey-900 mb-4">
                <span className="gradient-text">Conta Criada com Sucesso!</span>
              </h1>
              
              <p className="text-warmGrey-700 mb-6">
                Sua conta de gestor e empresa foram criadas com sucesso. Você já está logado e pode começar a usar o sistema.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/manager')}
                  className="btn-primary w-full"
                >
                  Ir para Painel de Gestão
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn-secondary w-full"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-navbar">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Chronos.work"
                width={1200}
                height={320}
                className="h-60 w-auto drop-shadow-lg"
              />
            </div>
            <button
              onClick={() => router.push('/')}
              className="btn-ghost"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-2">
              <span className="gradient-text">Registro de Gestor</span>
            </h1>
            <p className="text-warmGrey-700 font-medium">Crie sua conta de gestor e registre sua empresa</p>
          </div>

          {error && (
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-700 px-4 py-3 rounded-xl mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('manager')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'manager'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/30 backdrop-blur-sm text-warmGrey-700 hover:bg-white/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Dados Pessoais
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('company')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'company'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/30 backdrop-blur-sm text-warmGrey-700 hover:bg-white/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Dados da Empresa
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Manager Tab */}
            {activeTab === 'manager' && (
              <div className="glass-container p-8">
                <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações Pessoais do Gestor</h2>
                
                {/* Basic Info */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Dados Básicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="label">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={managerData.name}
                        onChange={handleManagerInputChange}
                        required
                        className="input"
                        placeholder="Digite seu nome completo"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={managerData.email}
                        onChange={handleManagerInputChange}
                        required
                        className="input"
                        placeholder="Digite seu email"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="label">
                        Senha <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={managerData.password}
                        onChange={handleManagerInputChange}
                        required
                        className="input"
                        placeholder="Mínimo 6 caracteres"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="label">
                        Confirmar Senha <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={managerData.confirmPassword}
                        onChange={handleManagerInputChange}
                        required
                        className="input"
                        placeholder="Digite a senha novamente"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Informações Pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cpf" className="label">CPF</label>
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={managerData.cpf}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="000.000.000-00"
                        disabled={loading}
                        maxLength={14}
                      />
                    </div>
                    <div>
                      <label htmlFor="rg" className="label">RG</label>
                      <input
                        type="text"
                        id="rg"
                        name="rg"
                        value={managerData.rg}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="00.000.000-0"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="birthDate" className="label">Data de Nascimento</label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={managerData.birthDate}
                        onChange={handleManagerInputChange}
                        className="input"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="label">Gênero</label>
                      <select
                        id="gender"
                        name="gender"
                        value={managerData.gender}
                        onChange={handleManagerInputChange}
                        className="input"
                        disabled={loading}
                      >
                        <option value="">Selecione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                        <option value="Prefiro não informar">Prefiro não informar</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="maritalStatus" className="label">Estado Civil</label>
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={managerData.maritalStatus}
                        onChange={handleManagerInputChange}
                        className="input"
                        disabled={loading}
                      >
                        <option value="">Selecione...</option>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                        <option value="União Estável">União Estável</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="education" className="label">Escolaridade</label>
                      <select
                        id="education"
                        name="education"
                        value={managerData.education}
                        onChange={handleManagerInputChange}
                        className="input"
                        disabled={loading}
                      >
                        <option value="">Selecione...</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Médio">Médio</option>
                        <option value="Superior">Superior</option>
                        <option value="Pós-graduação">Pós-graduação</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutorado">Doutorado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Contato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="label">Telefone Fixo</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={managerData.phone}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="(00) 0000-0000"
                        disabled={loading}
                        maxLength={14}
                      />
                    </div>
                    <div>
                      <label htmlFor="mobilePhone" className="label">Celular</label>
                      <input
                        type="tel"
                        id="mobilePhone"
                        name="mobilePhone"
                        value={managerData.mobilePhone}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="(00) 90000-0000"
                        disabled={loading}
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label htmlFor="zipCode" className="label">CEP</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={managerData.zipCode}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="00000-000"
                        disabled={loading}
                        maxLength={9}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="label">Endereço</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={managerData.address}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="Rua, Avenida, etc."
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="addressNumber" className="label">Número</label>
                      <input
                        type="text"
                        id="addressNumber"
                        name="addressNumber"
                        value={managerData.addressNumber}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="123"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="addressComplement" className="label">Complemento</label>
                      <input
                        type="text"
                        id="addressComplement"
                        name="addressComplement"
                        value={managerData.addressComplement}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="Apto, Sala, etc."
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="neighborhood" className="label">Bairro</label>
                      <input
                        type="text"
                        id="neighborhood"
                        name="neighborhood"
                        value={managerData.neighborhood}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="Centro"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="label">Cidade</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={managerData.city}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="São Paulo"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="label">Estado</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={managerData.state}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="SP"
                        disabled={loading}
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Banking Info */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Informações Bancárias</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bankName" className="label">Banco</label>
                      <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={managerData.bankName}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="Banco do Brasil"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="bankAccount" className="label">Conta</label>
                      <input
                        type="text"
                        id="bankAccount"
                        name="bankAccount"
                        value={managerData.bankAccount}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="12345-6"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="bankAgency" className="label">Agência</label>
                      <input
                        type="text"
                        id="bankAgency"
                        name="bankAgency"
                        value={managerData.bankAgency}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="1234"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="bankAccountType" className="label">Tipo de Conta</label>
                      <select
                        id="bankAccountType"
                        name="bankAccountType"
                        value={managerData.bankAccountType}
                        onChange={handleManagerInputChange}
                        className="input"
                        disabled={loading}
                      >
                        <option value="">Selecione...</option>
                        <option value="Corrente">Corrente</option>
                        <option value="Poupança">Poupança</option>
                        <option value="Salário">Salário</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="pix" className="label">PIX</label>
                      <input
                        type="text"
                        id="pix"
                        name="pix"
                        value={managerData.pix}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="Chave PIX (CPF, email, telefone, etc.)"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Contato de Emergência</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="emergencyContactName" className="label">Nome</label>
                      <input
                        type="text"
                        id="emergencyContactName"
                        name="emergencyContactName"
                        value={managerData.emergencyContactName}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="Nome do contato"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyContactPhone" className="label">Telefone</label>
                      <input
                        type="tel"
                        id="emergencyContactPhone"
                        name="emergencyContactPhone"
                        value={managerData.emergencyContactPhone}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="(00) 90000-0000"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyContactRelationship" className="label">Parentesco</label>
                      <input
                        type="text"
                        id="emergencyContactRelationship"
                        name="emergencyContactRelationship"
                        value={managerData.emergencyContactRelationship}
                        onChange={handleManagerInputChange}
                        className="input"
                        placeholder="Pai, Mãe, Cônjuge, etc."
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="glass-container p-8">
                <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações da Empresa</h2>
                
                {/* Basic Company Info */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Dados Básicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="companyName" className="label">
                        Nome da Empresa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="name"
                        value={companyData.name}
                        onChange={handleCompanyInputChange}
                        required
                        className="input"
                        placeholder="Digite o nome da empresa"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="cnpj" className="label">
                        CNPJ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cnpj"
                        name="cnpj"
                        value={companyData.cnpj}
                        onChange={handleCompanyInputChange}
                        required
                        className="input"
                        placeholder="00.000.000/0000-00"
                        disabled={loading}
                        maxLength={18}
                      />
                    </div>
                    <div>
                      <label htmlFor="corporateName" className="label">Razão Social</label>
                      <input
                        type="text"
                        id="corporateName"
                        name="corporateName"
                        value={companyData.corporateName}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="Razão social da empresa"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="companyEmail" className="label">Email da Empresa</label>
                      <input
                        type="email"
                        id="companyEmail"
                        name="email"
                        value={companyData.email}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="contato@empresa.com"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="companyPhone" className="label">Telefone</label>
                      <input
                        type="tel"
                        id="companyPhone"
                        name="phone"
                        value={companyData.phone}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="(00) 0000-0000"
                        disabled={loading}
                        maxLength={14}
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="label">Website</label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={companyData.website}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="https://www.empresa.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Address */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Endereço da Empresa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label htmlFor="companyZipCode" className="label">CEP</label>
                      <input
                        type="text"
                        id="companyZipCode"
                        name="zipCode"
                        value={companyData.zipCode}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="00000-000"
                        disabled={loading}
                        maxLength={9}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="companyAddress" className="label">Endereço</label>
                      <input
                        type="text"
                        id="companyAddress"
                        name="address"
                        value={companyData.address}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="Rua, Avenida, etc."
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="companyAddressNumber" className="label">Número</label>
                      <input
                        type="text"
                        id="companyAddressNumber"
                        name="addressNumber"
                        value={companyData.addressNumber}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="123"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="companyAddressComplement" className="label">Complemento</label>
                      <input
                        type="text"
                        id="companyAddressComplement"
                        name="addressComplement"
                        value={companyData.addressComplement}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="Sala, Andar, etc."
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="companyNeighborhood" className="label">Bairro</label>
                      <input
                        type="text"
                        id="companyNeighborhood"
                        name="neighborhood"
                        value={companyData.neighborhood}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="Centro"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="companyCity" className="label">Cidade</label>
                      <input
                        type="text"
                        id="companyCity"
                        name="city"
                        value={companyData.city}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="São Paulo"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="companyState" className="label">Estado</label>
                      <input
                        type="text"
                        id="companyState"
                        name="state"
                        value={companyData.state}
                        onChange={handleCompanyInputChange}
                        className="input"
                        placeholder="SP"
                        disabled={loading}
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Descrição da Empresa</h3>
                  <div>
                    <label htmlFor="description" className="label">Descrição</label>
                    <textarea
                      id="description"
                      name="description"
                      value={companyData.description}
                      onChange={(e) => setCompanyData(prev => ({ ...prev, description: e.target.value }))}
                      className="input min-h-[100px] resize-y"
                      placeholder="Descreva brevemente a empresa, sua área de atuação, etc."
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Criar Conta de Gestor'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}