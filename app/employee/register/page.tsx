'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';

type Tab = 'basicos' | 'pessoais' | 'endereco' | 'profissionais' | 'bancarios' | 'emergencia';

function EmployeeRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerEmployee } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('basicos');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get invitation code from URL params
  const invitationCode = searchParams.get('code') || '';

  // Employee data
  const [employeeData, setEmployeeData] = useState({
    invitationCode: invitationCode,
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
    employeeId: '',
    department: '',
    position: '',
    hireDate: '',
    salary: '',
    workSchedule: '',
    employmentType: '' as 'CLT' | 'PJ' | 'Estagiário' | 'Freelancer' | 'Temporário' | 'Autônomo' | '',
    directSupervisor: '',
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

  // Formatting functions
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    setEmployeeData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (employeeData.password !== employeeData.confirmPassword) {
      setError('As senhas não correspondem');
      setActiveTab('basicos');
      return;
    }

    if (employeeData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setActiveTab('basicos');
      return;
    }

    if (employeeData.name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      setActiveTab('basicos');
      return;
    }

    if (!employeeData.invitationCode) {
      setError('Código de convite é obrigatório');
      setActiveTab('basicos');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const requestData = {
        invitationCode: employeeData.invitationCode,
        name: employeeData.name,
        email: employeeData.email,
        password: employeeData.password,
        // Add optional fields only if filled
        ...(employeeData.cpf && { cpf: employeeData.cpf.replace(/\D/g, '') }),
        ...(employeeData.rg && { rg: employeeData.rg }),
        ...(employeeData.birthDate && { birthDate: employeeData.birthDate }),
        ...(employeeData.gender && { gender: employeeData.gender }),
        ...(employeeData.maritalStatus && { maritalStatus: employeeData.maritalStatus }),
        ...(employeeData.phone && { phone: employeeData.phone }),
        ...(employeeData.mobilePhone && { mobilePhone: employeeData.mobilePhone }),
        ...(employeeData.address && { address: employeeData.address }),
        ...(employeeData.addressNumber && { addressNumber: employeeData.addressNumber }),
        ...(employeeData.addressComplement && { addressComplement: employeeData.addressComplement }),
        ...(employeeData.neighborhood && { neighborhood: employeeData.neighborhood }),
        ...(employeeData.city && { city: employeeData.city }),
        ...(employeeData.state && { state: employeeData.state }),
        ...(employeeData.zipCode && { zipCode: employeeData.zipCode.replace(/\D/g, '') }),
        ...(employeeData.country && { country: employeeData.country }),
        ...(employeeData.employeeId && { employeeId: employeeData.employeeId }),
        ...(employeeData.department && { department: employeeData.department }),
        ...(employeeData.position && { position: employeeData.position }),
        ...(employeeData.hireDate && { hireDate: employeeData.hireDate }),
        ...(employeeData.salary && { salary: parseFloat(employeeData.salary) }),
        ...(employeeData.workSchedule && { workSchedule: employeeData.workSchedule }),
        ...(employeeData.employmentType && { employmentType: employeeData.employmentType }),
        ...(employeeData.directSupervisor && { directSupervisor: employeeData.directSupervisor }),
        ...(employeeData.bankName && { bankName: employeeData.bankName }),
        ...(employeeData.bankAccount && { bankAccount: employeeData.bankAccount }),
        ...(employeeData.bankAgency && { bankAgency: employeeData.bankAgency }),
        ...(employeeData.bankAccountType && { bankAccountType: employeeData.bankAccountType }),
        ...(employeeData.pix && { pix: employeeData.pix }),
        ...(employeeData.emergencyContactName && { emergencyContactName: employeeData.emergencyContactName }),
        ...(employeeData.emergencyContactPhone && { emergencyContactPhone: employeeData.emergencyContactPhone }),
        ...(employeeData.emergencyContactRelationship && { emergencyContactRelationship: employeeData.emergencyContactRelationship }),
        ...(employeeData.education && { education: employeeData.education }),
        ...(employeeData.notes && { notes: employeeData.notes }),
      };

      await registerEmployee(requestData);
      setSuccess(true);
      
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'basicos' as Tab,
      label: 'Básicos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'pessoais' as Tab,
      label: 'Pessoais',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'endereco' as Tab,
      label: 'Endereço',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'profissionais' as Tab,
      label: 'Profissionais',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'bancarios' as Tab,
      label: 'Bancários',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'emergencia' as Tab,
      label: 'Emergência',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
  ];

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
                <span className="gradient-text">Cadastro Realizado com Sucesso!</span>
              </h1>
              
              <p className="text-warmGrey-700 mb-6">
                Seu cadastro foi realizado com sucesso. Aguarde a aprovação do gestor para começar a usar o sistema.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/login')}
                  className="btn-primary w-full"
                >
                  Fazer Login
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <InteractiveBackground />

      <div className="max-w-4xl w-full relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="Chronos.work"
            width={1100}
            height={300}
            className="h-60 w-auto drop-shadow-lg"
          />
        </div>

        {/* Register Card */}
        <div className="glass-container p-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Cadastro de Funcionário</span>
          </h1>
          <p className="text-warmGrey-700 font-medium mb-6">Preencha seus dados para se juntar à empresa</p>

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
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 flex-1 min-w-[90px] justify-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/30 backdrop-blur-sm text-warmGrey-700 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Campos Básicos */}
            {activeTab === 'basicos' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="invitationCode" className="label">
                    Código de Convite <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="invitationCode"
                    type="text"
                    required
                    className="input"
                    placeholder="Digite o código de convite"
                    value={employeeData.invitationCode}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <p className="text-xs text-warmGrey-600 mt-1">Código fornecido pelo gestor da empresa</p>
                </div>

                <div>
                  <label htmlFor="name" className="label">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="input"
                    placeholder="João Silva"
                    value={employeeData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    minLength={3}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input"
                    placeholder="voce@exemplo.com"
                    value={employeeData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="label">
                    Senha <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="input"
                    placeholder="••••••••"
                    value={employeeData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    minLength={6}
                  />
                  <p className="text-xs text-warmGrey-600 mt-1">Mínimo de 6 caracteres</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">
                    Confirmar Senha <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="input"
                    placeholder="••••••••"
                    value={employeeData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Dados Pessoais */}
            {activeTab === 'pessoais' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cpf" className="label">CPF</label>
                    <input
                      id="cpf"
                      type="text"
                      className="input"
                      placeholder="000.000.000-00"
                      value={employeeData.cpf}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label htmlFor="rg" className="label">RG</label>
                    <input
                      id="rg"
                      type="text"
                      className="input"
                      placeholder="00.000.000-0"
                      value={employeeData.rg}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birthDate" className="label">Data de Nascimento</label>
                    <input
                      id="birthDate"
                      type="date"
                      className="input"
                      value={employeeData.birthDate}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="label">Gênero</label>
                    <select
                      id="gender"
                      className="input"
                      value={employeeData.gender}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      <option value="">Selecione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                      <option value="Prefiro não informar">Prefiro não informar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="maritalStatus" className="label">Estado Civil</label>
                  <select
                    id="maritalStatus"
                    className="input"
                    value={employeeData.maritalStatus}
                    onChange={handleInputChange}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="label">Telefone Fixo</label>
                    <input
                      id="phone"
                      type="tel"
                      className="input"
                      placeholder="(00) 0000-0000"
                      value={employeeData.phone}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label htmlFor="mobilePhone" className="label">Celular</label>
                    <input
                      id="mobilePhone"
                      type="tel"
                      className="input"
                      placeholder="(00) 90000-0000"
                      value={employeeData.mobilePhone}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={15}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="education" className="label">Escolaridade</label>
                  <select
                    id="education"
                    className="input"
                    value={employeeData.education}
                    onChange={handleInputChange}
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
            )}

            {/* Endereço */}
            {activeTab === 'endereco' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="label">CEP</label>
                    <input
                      id="zipCode"
                      type="text"
                      className="input"
                      placeholder="00000-000"
                      value={employeeData.zipCode}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={9}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="label">Endereço</label>
                    <input
                      id="address"
                      type="text"
                      className="input"
                      placeholder="Rua, Avenida, etc."
                      value={employeeData.address}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="addressNumber" className="label">Número</label>
                    <input
                      id="addressNumber"
                      type="text"
                      className="input"
                      placeholder="123"
                      value={employeeData.addressNumber}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="addressComplement" className="label">Complemento</label>
                    <input
                      id="addressComplement"
                      type="text"
                      className="input"
                      placeholder="Apto, Sala, etc."
                      value={employeeData.addressComplement}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="neighborhood" className="label">Bairro</label>
                    <input
                      id="neighborhood"
                      type="text"
                      className="input"
                      placeholder="Centro"
                      value={employeeData.neighborhood}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="label">Cidade</label>
                    <input
                      id="city"
                      type="text"
                      className="input"
                      placeholder="São Paulo"
                      value={employeeData.city}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="label">Estado</label>
                    <input
                      id="state"
                      type="text"
                      className="input"
                      placeholder="SP"
                      value={employeeData.state}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="label">País</label>
                    <input
                      id="country"
                      type="text"
                      className="input"
                      placeholder="Brasil"
                      value={employeeData.country}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dados Profissionais */}
            {activeTab === 'profissionais' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="employeeId" className="label">ID do Funcionário</label>
                    <input
                      id="employeeId"
                      type="text"
                      className="input"
                      placeholder="EMP001"
                      value={employeeData.employeeId}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="label">Departamento</label>
                    <input
                      id="department"
                      type="text"
                      className="input"
                      placeholder="TI, RH, Vendas, etc."
                      value={employeeData.department}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="position" className="label">Cargo</label>
                    <input
                      id="position"
                      type="text"
                      className="input"
                      placeholder="Desenvolvedor, Analista, etc."
                      value={employeeData.position}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="hireDate" className="label">Data de Admissão</label>
                    <input
                      id="hireDate"
                      type="date"
                      className="input"
                      value={employeeData.hireDate}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="salary" className="label">Salário</label>
                    <input
                      id="salary"
                      type="number"
                      className="input"
                      placeholder="5000.00"
                      value={employeeData.salary}
                      onChange={handleInputChange}
                      disabled={loading}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label htmlFor="workSchedule" className="label">Horário de Trabalho</label>
                    <input
                      id="workSchedule"
                      type="text"
                      className="input"
                      placeholder="08:00 às 17:00"
                      value={employeeData.workSchedule}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="employmentType" className="label">Tipo de Contrato</label>
                    <select
                      id="employmentType"
                      className="input"
                      value={employeeData.employmentType}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      <option value="">Selecione...</option>
                      <option value="CLT">CLT</option>
                      <option value="PJ">PJ</option>
                      <option value="Estagiário">Estagiário</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Temporário">Temporário</option>
                      <option value="Autônomo">Autônomo</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="directSupervisor" className="label">Supervisor Direto</label>
                    <input
                      id="directSupervisor"
                      type="text"
                      className="input"
                      placeholder="Nome do supervisor"
                      value={employeeData.directSupervisor}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dados Bancários */}
            {activeTab === 'bancarios' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankName" className="label">Banco</label>
                    <input
                      id="bankName"
                      type="text"
                      className="input"
                      placeholder="Banco do Brasil"
                      value={employeeData.bankName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="bankAccount" className="label">Conta</label>
                    <input
                      id="bankAccount"
                      type="text"
                      className="input"
                      placeholder="12345-6"
                      value={employeeData.bankAccount}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankAgency" className="label">Agência</label>
                    <input
                      id="bankAgency"
                      type="text"
                      className="input"
                      placeholder="1234"
                      value={employeeData.bankAgency}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="bankAccountType" className="label">Tipo de Conta</label>
                    <select
                      id="bankAccountType"
                      className="input"
                      value={employeeData.bankAccountType}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      <option value="">Selecione...</option>
                      <option value="Corrente">Corrente</option>
                      <option value="Poupança">Poupança</option>
                      <option value="Salário">Salário</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="pix" className="label">PIX</label>
                  <input
                    id="pix"
                    type="text"
                    className="input"
                    placeholder="Chave PIX (CPF, email, telefone, etc.)"
                    value={employeeData.pix}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Contato de Emergência */}
            {activeTab === 'emergencia' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="emergencyContactName" className="label">Nome</label>
                    <input
                      id="emergencyContactName"
                      type="text"
                      className="input"
                      placeholder="Nome do contato"
                      value={employeeData.emergencyContactName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactPhone" className="label">Telefone</label>
                    <input
                      id="emergencyContactPhone"
                      type="tel"
                      className="input"
                      placeholder="(00) 90000-0000"
                      value={employeeData.emergencyContactPhone}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactRelationship" className="label">Parentesco</label>
                    <input
                      id="emergencyContactRelationship"
                      type="text"
                      className="input"
                      placeholder="Pai, Mãe, Cônjuge, etc."
                      value={employeeData.emergencyContactRelationship}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="label">Observações</label>
                  <textarea
                    id="notes"
                    className="input min-h-[100px] resize-y"
                    placeholder="Informações adicionais..."
                    value={employeeData.notes}
                    onChange={(e) => setEmployeeData(prev => ({ ...prev, notes: e.target.value }))}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
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
                  'Cadastrar Funcionário'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeRegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EmployeeRegisterContent />
    </Suspense>
  );
}