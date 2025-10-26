'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InteractiveBackground from '../components/InteractiveBackground';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'basicos' | 'pessoais' | 'endereco' | 'profissionais' | 'bancarios' | 'emergencia';

export default function RegisterPage() {
  const { register } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('basicos');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Campos Básicos (obrigatórios)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dados Pessoais
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [education, setEducation] = useState('');

  // Endereço
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Brasil');

  // Dados Profissionais
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [salary, setSalary] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [directSupervisor, setDirectSupervisor] = useState('');

  // Dados Bancários
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankAgency, setBankAgency] = useState('');
  const [bankAccountType, setBankAccountType] = useState('');
  const [pix, setPix] = useState('');

  // Contato de Emergência
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [notes, setNotes] = useState('');

  // Funções de formatação de máscaras
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação
    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      setActiveTab('basicos');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setActiveTab('basicos');
      return;
    }

    if (name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      setActiveTab('basicos');
      return;
    }

    setLoading(true);

    try {
      const requestBody: any = {
        name,
        email,
        password,
      };

      // Adicionar campos opcionais apenas se preenchidos
      if (cpf) requestBody.cpf = cpf.replace(/\D/g, '');
      if (rg) requestBody.rg = rg;
      if (birthDate) requestBody.birthDate = birthDate;
      if (gender) requestBody.gender = gender;
      if (maritalStatus) requestBody.maritalStatus = maritalStatus;
      if (phone) requestBody.phone = phone;
      if (mobilePhone) requestBody.mobilePhone = mobilePhone;
      if (education) requestBody.education = education;

      if (zipCode) requestBody.zipCode = zipCode.replace(/\D/g, '');
      if (address) requestBody.address = address;
      if (addressNumber) requestBody.addressNumber = addressNumber;
      if (addressComplement) requestBody.addressComplement = addressComplement;
      if (neighborhood) requestBody.neighborhood = neighborhood;
      if (city) requestBody.city = city;
      if (state) requestBody.state = state;
      if (country) requestBody.country = country;

      if (employeeId) requestBody.employeeId = employeeId;
      if (department) requestBody.department = department;
      if (position) requestBody.position = position;
      if (hireDate) requestBody.hireDate = hireDate;
      if (salary) requestBody.salary = parseFloat(salary);
      if (workSchedule) requestBody.workSchedule = workSchedule;
      if (employmentType) requestBody.employmentType = employmentType;
      if (directSupervisor) requestBody.directSupervisor = directSupervisor;

      if (bankName) requestBody.bankName = bankName;
      if (bankAccount) requestBody.bankAccount = bankAccount;
      if (bankAgency) requestBody.bankAgency = bankAgency;
      if (bankAccountType) requestBody.bankAccountType = bankAccountType;
      if (pix) requestBody.pix = pix;

      if (emergencyContactName) requestBody.emergencyContactName = emergencyContactName;
      if (emergencyContactPhone) requestBody.emergencyContactPhone = emergencyContactPhone;
      if (emergencyContactRelationship) requestBody.emergencyContactRelationship = emergencyContactRelationship;
      if (notes) requestBody.notes = notes;

      await register(requestBody);
    } catch (err) {
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <InteractiveBackground />

      <div className="max-w-4xl w-full relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="Chronos.work"
            width={1100}
            height={300}
            className="h-60 w-auto drop-shadow-lg"
          />
        </Link>

        {/* Register Card */}
        <div className="glass-container p-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Criar uma conta</span>
          </h1>
          <p className="text-warmGrey-700 font-medium mb-6">Preencha seus dados para começar</p>

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
                  <label htmlFor="name" className="label">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="input"
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
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
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
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
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="label">Gênero</label>
                    <select
                      id="gender"
                      className="input"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
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
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
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
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(formatMobilePhone(e.target.value))}
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
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
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
                      value={zipCode}
                      onChange={(e) => setZipCode(formatCEP(e.target.value))}
                      disabled={loading}
                      maxLength={9}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="label">Logradouro</label>
                    <input
                      id="address"
                      type="text"
                      className="input"
                      placeholder="Rua das Flores"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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
                      value={addressNumber}
                      onChange={(e) => setAddressNumber(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="addressComplement" className="label">Complemento</label>
                    <input
                      id="addressComplement"
                      type="text"
                      className="input"
                      placeholder="Apto 45"
                      value={addressComplement}
                      onChange={(e) => setAddressComplement(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="neighborhood" className="label">Bairro</label>
                  <input
                    id="neighborhood"
                    type="text"
                    className="input"
                    placeholder="Centro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="city" className="label">Cidade</label>
                    <input
                      id="city"
                      type="text"
                      className="input"
                      placeholder="São Paulo"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="label">UF</label>
                    <input
                      id="state"
                      type="text"
                      className="input"
                      placeholder="SP"
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      disabled={loading}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="label">País</label>
                  <input
                    id="country"
                    type="text"
                    className="input"
                    placeholder="Brasil"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Dados Profissionais */}
            {activeTab === 'profissionais' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="employeeId" className="label">Matrícula</label>
                    <input
                      id="employeeId"
                      type="text"
                      className="input"
                      placeholder="EMP001"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="label">Departamento</label>
                    <input
                      id="department"
                      type="text"
                      className="input"
                      placeholder="TI"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="position" className="label">Cargo</label>
                  <input
                    id="position"
                    type="text"
                    className="input"
                    placeholder="Desenvolvedor Full Stack"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hireDate" className="label">Data de Contratação</label>
                    <input
                      id="hireDate"
                      type="date"
                      className="input"
                      value={hireDate}
                      onChange={(e) => setHireDate(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="salary" className="label">Salário</label>
                    <input
                      id="salary"
                      type="number"
                      className="input"
                      placeholder="5000.00"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      disabled={loading}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="workSchedule" className="label">Jornada de Trabalho</label>
                  <input
                    id="workSchedule"
                    type="text"
                    className="input"
                    placeholder="Segunda a Sexta, 9h às 18h"
                    value={workSchedule}
                    onChange={(e) => setWorkSchedule(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="employmentType" className="label">Tipo de Contrato</label>
                  <select
                    id="employmentType"
                    className="input"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
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
                    placeholder="João Santos"
                    value={directSupervisor}
                    onChange={(e) => setDirectSupervisor(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Dados Bancários */}
            {activeTab === 'bancarios' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="bankName" className="label">Banco</label>
                  <input
                    id="bankName"
                    type="text"
                    className="input"
                    placeholder="Banco do Brasil"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankAgency" className="label">Agência</label>
                    <input
                      id="bankAgency"
                      type="text"
                      className="input"
                      placeholder="1234"
                      value={bankAgency}
                      onChange={(e) => setBankAgency(e.target.value)}
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
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bankAccountType" className="label">Tipo de Conta</label>
                  <select
                    id="bankAccountType"
                    className="input"
                    value={bankAccountType}
                    onChange={(e) => setBankAccountType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Selecione...</option>
                    <option value="Corrente">Corrente</option>
                    <option value="Poupança">Poupança</option>
                    <option value="Salário">Salário</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pix" className="label">Chave PIX</label>
                  <input
                    id="pix"
                    type="text"
                    className="input"
                    placeholder="seu@email.com ou CPF"
                    value={pix}
                    onChange={(e) => setPix(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Contato de Emergência */}
            {activeTab === 'emergencia' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="emergencyContactName" className="label">Nome do Contato</label>
                  <input
                    id="emergencyContactName"
                    type="text"
                    className="input"
                    placeholder="Maria Silva"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactPhone" className="label">Telefone do Contato</label>
                  <input
                    id="emergencyContactPhone"
                    type="tel"
                    className="input"
                    placeholder="(00) 90000-0000"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(formatMobilePhone(e.target.value))}
                    disabled={loading}
                    maxLength={15}
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactRelationship" className="label">Parentesco</label>
                  <input
                    id="emergencyContactRelationship"
                    type="text"
                    className="input"
                    placeholder="Mãe, Pai, Cônjuge..."
                    value={emergencyContactRelationship}
                    onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="label">Observações Adicionais</label>
                  <textarea
                    id="notes"
                    className="input"
                    placeholder="Informações adicionais relevantes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={loading}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                className="btn-primary flex-1 text-lg py-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Criando conta...
                  </span>
                ) : (
                  'Criar conta'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-warmGrey-700">Já tem uma conta? </span>
            <Link href="/login" className="gradient-text font-semibold hover:opacity-80 transition-opacity">
              Entrar
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-warmGrey-700 hover:text-warmGrey-900 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white/20 backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
