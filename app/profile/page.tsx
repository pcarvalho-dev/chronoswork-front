'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext';
import { UpdateProfileData } from '@/app/lib/api';
import InteractiveBackground from '@/app/components/InteractiveBackground';

type TabType = 'personal' | 'contact' | 'address' | 'professional' | 'banking' | 'emergency';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        cpf: user.cpf || '',
        rg: user.rg || '',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        maritalStatus: user.maritalStatus || '',
        phone: user.phone || '',
        mobilePhone: user.mobilePhone || '',
        address: user.address || '',
        addressNumber: user.addressNumber || '',
        addressComplement: user.addressComplement || '',
        neighborhood: user.neighborhood || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'Brasil',
        employeeId: user.employeeId || '',
        department: user.department || '',
        position: user.position || '',
        hireDate: user.hireDate || '',
        salary: user.salary || undefined,
        workSchedule: user.workSchedule || '',
        employmentType: user.employmentType || '',
        directSupervisor: user.directSupervisor || '',
        bankName: user.bankName || '',
        bankAccount: user.bankAccount || '',
        bankAgency: user.bankAgency || '',
        bankAccountType: user.bankAccountType || '',
        pix: user.pix || '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactPhone: user.emergencyContactPhone || '',
        emergencyContactRelationship: user.emergencyContactRelationship || '',
        education: user.education || '',
        notes: user.notes || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Remove empty strings and undefined values
      const dataToUpdate = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '' && v !== undefined)
      ) as UpdateProfileData;

      await updateProfile(dataToUpdate);
      setSuccess('Perfil atualizado com sucesso!');

      // Scroll to top to show success message
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'personal' as TabType,
      label: 'Pessoal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'contact' as TabType,
      label: 'Contato',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      id: 'address' as TabType,
      label: 'Endereço',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'professional' as TabType,
      label: 'Profissional',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'banking' as TabType,
      label: 'Bancário',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'emergency' as TabType,
      label: 'Emergência',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <InteractiveBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-warmGrey-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Navbar */}
      <nav className="glass-container border-b border-white/20 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-navbar">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Chronos.work"
                width={180}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-warmGrey-900">{user?.name}</p>
                <p className="text-sm text-warmGrey-600">{user?.email}</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-ghost"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="gradient-text">Meu Perfil</span>
          </h1>
          <p className="text-warmGrey-700 font-medium">Atualize suas informações pessoais e profissionais</p>
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

        {success && (
          <div className="bg-green-500/10 backdrop-blur-md border border-green-500/30 text-green-700 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tabs Navigation */}
          <div className="glass-container p-2 mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/30 text-warmGrey-700 hover:bg-white/50'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="glass-container p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-warmGrey-900">Informações Pessoais</h2>
                    <p className="text-warmGrey-600 text-sm">Dados básicos e documentos</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="label">Nome Completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="input"
                      required
                      minLength={3}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="label">CPF</label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="00000000000"
                      maxLength={11}
                    />
                  </div>
                  <div>
                    <label htmlFor="rg" className="label">RG</label>
                    <input
                      type="text"
                      id="rg"
                      name="rg"
                      value={formData.rg || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="birthDate" className="label">Data de Nascimento</label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="label">Gênero</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Selecione</option>
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
                      value={formData.maritalStatus || ''}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Selecione</option>
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
                      value={formData.education || ''}
                      onChange={handleChange}
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
                </div>
              </div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <div className="glass-container p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-warmGrey-900">Contato</h2>
                    <p className="text-warmGrey-600 text-sm">Telefones e meios de comunicação</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="label">Telefone Fixo</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobilePhone" className="label">Celular</label>
                    <input
                      type="tel"
                      id="mobilePhone"
                      name="mobilePhone"
                      value={formData.mobilePhone || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Address */}
            {activeTab === 'address' && (
              <div className="glass-container p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-warmGrey-900">Endereço</h2>
                    <p className="text-warmGrey-600 text-sm">Localização e endereço completo</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="zipCode" className="label">CEP</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="00000000"
                      maxLength={8}
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="label">Logradouro</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="addressNumber" className="label">Número</label>
                    <input
                      type="text"
                      id="addressNumber"
                      name="addressNumber"
                      value={formData.addressNumber || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="addressComplement" className="label">Complemento</label>
                    <input
                      type="text"
                      id="addressComplement"
                      name="addressComplement"
                      value={formData.addressComplement || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="neighborhood" className="label">Bairro</label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="label">Cidade</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="label">Estado (UF)</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="label">País</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional */}
            {activeTab === 'professional' && (
              <div className="glass-container p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-warmGrey-900">Informações Profissionais</h2>
                    <p className="text-warmGrey-600 text-sm">Dados de emprego e carreira</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="employeeId" className="label">Matrícula</label>
                    <input
                      type="text"
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="label">Departamento</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="label">Cargo</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="hireDate" className="label">Data de Contratação</label>
                    <input
                      type="date"
                      id="hireDate"
                      name="hireDate"
                      value={formData.hireDate || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="salary" className="label">Salário (R$)</label>
                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      value={formData.salary || ''}
                      onChange={handleChange}
                      className="input"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="employmentType" className="label">Tipo de Contrato</label>
                    <select
                      id="employmentType"
                      name="employmentType"
                      value={formData.employmentType || ''}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Selecione</option>
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
                      type="text"
                      id="directSupervisor"
                      name="directSupervisor"
                      value={formData.directSupervisor || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="workSchedule" className="label">Jornada de Trabalho</label>
                    <input
                      type="text"
                      id="workSchedule"
                      name="workSchedule"
                      value={formData.workSchedule || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="Segunda a Sexta, 9h às 18h"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="label">Observações</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      className="input min-h-[100px] resize-y"
                      placeholder="Informações adicionais relevantes..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Banking */}
            {activeTab === 'banking' && (
              <div className="glass-container p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-warmGrey-900">Informações Bancárias</h2>
                    <p className="text-warmGrey-600 text-sm">Dados para pagamento</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bankName" className="label">Banco</label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="bankAgency" className="label">Agência</label>
                    <input
                      type="text"
                      id="bankAgency"
                      name="bankAgency"
                      value={formData.bankAgency || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="bankAccount" className="label">Conta</label>
                    <input
                      type="text"
                      id="bankAccount"
                      name="bankAccount"
                      value={formData.bankAccount || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="bankAccountType" className="label">Tipo de Conta</label>
                    <select
                      id="bankAccountType"
                      name="bankAccountType"
                      value={formData.bankAccountType || ''}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Selecione</option>
                      <option value="Corrente">Corrente</option>
                      <option value="Poupança">Poupança</option>
                      <option value="Salário">Salário</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="pix" className="label">Chave PIX</label>
                    <input
                      type="text"
                      id="pix"
                      name="pix"
                      value={formData.pix || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {activeTab === 'emergency' && (
              <div className="glass-container p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-warmGrey-900">Contato de Emergência</h2>
                    <p className="text-warmGrey-600 text-sm">Pessoa para contato em caso de emergência</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="emergencyContactName" className="label">Nome</label>
                    <input
                      type="text"
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={formData.emergencyContactName || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="emergencyContactPhone" className="label">Telefone</label>
                    <input
                      type="tel"
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="emergencyContactRelationship" className="label">Grau de Parentesco</label>
                    <input
                      type="text"
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship || ''}
                      onChange={handleChange}
                      className="input"
                      placeholder="Ex: Mãe, Pai, Irmão(ã), Cônjuge"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="glass-container p-6 mt-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn-secondary px-8"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary px-8"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvar Alterações
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
