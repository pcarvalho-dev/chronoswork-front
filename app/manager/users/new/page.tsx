'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, CreateUserData } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';

export default function NewUserPage() {
  const { isManager, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    cpf: '',
    rg: '',
    birthDate: '',
    gender: '',
    maritalStatus: '',
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
    salary: 0,
    workSchedule: '',
    employmentType: '',
    directSupervisor: '',
    bankName: '',
    bankAccount: '',
    bankAgency: '',
    bankAccountType: '',
    pix: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    education: '',
    notes: '',
  });

  // Redirect if not manager
  useEffect(() => {
    if (!authLoading && !isManager) {
      router.push('/login');
    }
  }, [isManager, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen relative">
        <InteractiveBackground />
        <div className="container-custom py-12 relative z-10">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto text-primary-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-warmGrey-600 font-medium">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not manager
  if (!isManager) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!formData.name || !formData.email || !formData.password) {
        setError('Nome, email e senha são obrigatórios');
        return;
      }

      await api.createUser(formData);
      router.push('/manager/users');
    } catch (err: any) {
      setError(err.message || 'Falha ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-navbar">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/manager/users')}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <svg className="w-6 h-6 text-warmGrey-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Chronos.work"
                  width={1200}
                  height={320}
                  className="h-60 w-auto drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-2">
              <span className="gradient-text">Novo Usuário</span>
            </h1>
            <p className="text-warmGrey-700 font-medium">Crie uma nova conta de usuário</p>
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="label">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Digite o email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="label">
                    Senha *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Digite a senha"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="label">
                    Função *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="input"
                  >
                    <option value="employee">Funcionário</option>
                    <option value="manager">Gestor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cpf" className="label">
                    CPF
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label htmlFor="rg" className="label">
                    RG
                  </label>
                  <input
                    type="text"
                    id="rg"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Digite o RG"
                  />
                </div>
                <div>
                  <label htmlFor="birthDate" className="label">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="label">
                    Gênero
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="maritalStatus" className="label">
                    Estado Civil
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Selecione</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phone" className="label">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="(00) 0000-0000"
                  />
                </div>
                <div>
                  <label htmlFor="mobilePhone" className="label">
                    Celular
                  </label>
                  <input
                    type="tel"
                    id="mobilePhone"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="label">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                <div>
                  <label htmlFor="addressNumber" className="label">
                    Número
                  </label>
                  <input
                    type="text"
                    id="addressNumber"
                    name="addressNumber"
                    value={formData.addressNumber}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label htmlFor="addressComplement" className="label">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="addressComplement"
                    name="addressComplement"
                    value={formData.addressComplement}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Apto, Bloco, etc."
                  />
                </div>
                <div>
                  <label htmlFor="neighborhood" className="label">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nome do bairro"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="label">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nome da cidade"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="label">
                    Estado
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="UF"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="label">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="label">
                    País
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="País"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações Profissionais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employeeId" className="label">
                    ID do Funcionário
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="ID único do funcionário"
                  />
                </div>
                <div>
                  <label htmlFor="department" className="label">
                    Departamento
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ex: TI, RH, Vendas"
                  />
                </div>
                <div>
                  <label htmlFor="position" className="label">
                    Cargo
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ex: Desenvolvedor, Analista"
                  />
                </div>
                <div>
                  <label htmlFor="hireDate" className="label">
                    Data de Contratação
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="salary" className="label">
                    Salário
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="workSchedule" className="label">
                    Horário de Trabalho
                  </label>
                  <input
                    type="text"
                    id="workSchedule"
                    name="workSchedule"
                    value={formData.workSchedule}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ex: 08:00 às 17:00"
                  />
                </div>
                <div>
                  <label htmlFor="employmentType" className="label">
                    Tipo de Contrato
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Selecione</option>
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="Estagiário">Estagiário</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="directSupervisor" className="label">
                    Supervisor Direto
                  </label>
                  <input
                    type="text"
                    id="directSupervisor"
                    name="directSupervisor"
                    value={formData.directSupervisor}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nome do supervisor"
                  />
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações Bancárias</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bankName" className="label">
                    Banco
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nome do banco"
                  />
                </div>
                <div>
                  <label htmlFor="bankAccount" className="label">
                    Conta
                  </label>
                  <input
                    type="text"
                    id="bankAccount"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Número da conta"
                  />
                </div>
                <div>
                  <label htmlFor="bankAgency" className="label">
                    Agência
                  </label>
                  <input
                    type="text"
                    id="bankAgency"
                    name="bankAgency"
                    value={formData.bankAgency}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Número da agência"
                  />
                </div>
                <div>
                  <label htmlFor="bankAccountType" className="label">
                    Tipo de Conta
                  </label>
                  <select
                    id="bankAccountType"
                    name="bankAccountType"
                    value={formData.bankAccountType}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Selecione</option>
                    <option value="Corrente">Corrente</option>
                    <option value="Poupança">Poupança</option>
                    <option value="Salário">Salário</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="pix" className="label">
                    PIX
                  </label>
                  <input
                    type="text"
                    id="pix"
                    name="pix"
                    value={formData.pix}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Chave PIX"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Contato de Emergência</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergencyContactName" className="label">
                    Nome do Contato
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContactPhone" className="label">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="emergencyContactRelationship" className="label">
                    Parentesco
                  </label>
                  <input
                    type="text"
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ex: Pai, Mãe, Cônjuge, etc."
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações Adicionais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="education" className="label">
                    Escolaridade
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Selecione</option>
                    <option value="Fundamental">Fundamental</option>
                    <option value="Médio">Médio</option>
                    <option value="Superior">Superior</option>
                    <option value="Pós-graduação">Pós-graduação</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="notes" className="label">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input"
                    rows={3}
                    placeholder="Observações adicionais..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push('/manager/users')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Criar Usuário'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}