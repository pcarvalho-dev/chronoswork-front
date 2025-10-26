'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { api, Company, UpdateCompanyData } from '@/app/lib/api';
import ManagerNavbar from '@/app/components/ManagerNavbar';

export default function CompanyManagementPage() {
  const { user, isManager } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateCompanyData>({});

  useEffect(() => {
    if (isManager) {
      loadCompany();
    }
  }, [isManager]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const response = await api.getCompany();
      setCompany(response.company);
      setFormData({
        name: response.company.name,
        cnpj: response.company.cnpj,
        corporateName: response.company.corporateName || '',
        email: response.company.email || '',
        phone: response.company.phone || '',
        website: response.company.website || '',
        address: response.company.address || '',
        addressNumber: response.company.addressNumber || '',
        addressComplement: response.company.addressComplement || '',
        neighborhood: response.company.neighborhood || '',
        city: response.company.city || '',
        state: response.company.state || '',
        zipCode: response.company.zipCode || '',
        country: response.company.country || 'Brasil',
        description: response.company.description || '',
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Remove empty strings and convert to undefined
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === '' ? undefined : value
        ])
      );

      const response = await api.updateCompany(cleanedData);
      setCompany(response.company);
      setIsEditing(false);
      setSuccess('Empresa atualizada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name,
        cnpj: company.cnpj,
        corporateName: company.corporateName || '',
        email: company.email || '',
        phone: company.phone || '',
        website: company.website || '',
        address: company.address || '',
        addressNumber: company.addressNumber || '',
        addressComplement: company.addressComplement || '',
        neighborhood: company.neighborhood || '',
        city: company.city || '',
        state: company.state || '',
        zipCode: company.zipCode || '',
        country: company.country || 'Brasil',
        description: company.description || '',
      });
    }
    setIsEditing(false);
  };

  if (!isManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warmGrey-50 to-warmGrey-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-warmGrey-900 mb-4">Acesso Negado</h1>
          <p className="text-warmGrey-700">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading && !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warmGrey-50 to-warmGrey-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-warmGrey-700">Carregando dados da empresa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmGrey-50 to-warmGrey-100">
      <ManagerNavbar />
      
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-warmGrey-900 mb-2">
                <span className="gradient-text">Gestão da Empresa</span>
              </h1>
              <p className="text-warmGrey-700">Gerencie as informações da sua empresa</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Empresa
              </button>
            )}
          </div>

          {/* Messages */}
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
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="glass-container p-8">
            <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações da Empresa</h2>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    Nome da Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="input"
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <label className="label">
                    CNPJ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="input"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="label">Razão Social</label>
                  <input
                    type="text"
                    name="corporateName"
                    value={formData.corporateName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="input"
                    placeholder="Razão social da empresa"
                  />
                </div>

                <div>
                  <label className="label">Email da Empresa</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="input"
                    placeholder="contato@empresa.com"
                  />
                </div>

                <div>
                  <label className="label">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="input"
                    placeholder="(00) 0000-0000"
                  />
                </div>

                <div>
                  <label className="label">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="input"
                    placeholder="https://www.empresa.com"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">CEP</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Endereço</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>

                  <div>
                    <label className="label">Número</label>
                    <input
                      type="text"
                      name="addressNumber"
                      value={formData.addressNumber || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label className="label">Complemento</label>
                    <input
                      type="text"
                      name="addressComplement"
                      value={formData.addressComplement || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="Sala, Andar, etc."
                    />
                  </div>

                  <div>
                    <label className="label">Bairro</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="Centro"
                    />
                  </div>

                  <div>
                    <label className="label">Cidade</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <label className="label">Estado</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="label">País</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="input"
                      placeholder="Brasil"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-warmGrey-800 mb-4">Descrição</h3>
                <div>
                  <label className="label">Descrição da Empresa</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="input min-h-[120px] resize-y"
                    placeholder="Descreva brevemente a empresa, sua área de atuação, etc."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-warmGrey-200">
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}