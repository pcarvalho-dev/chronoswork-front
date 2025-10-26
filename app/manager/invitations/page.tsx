'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { api, Invitation, CreateInvitationData } from '@/app/lib/api';
import ManagerNavbar from '@/app/components/ManagerNavbar';

export default function InvitationsManagementPage() {
  const { user, isManager } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateInvitationData>({
    email: '',
    name: '',
    position: '',
    department: '',
    expiresAt: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');

  useEffect(() => {
    if (isManager) {
      loadInvitations();
    }
  }, [isManager, pagination.page, statusFilter]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const status = statusFilter === 'all' ? undefined : statusFilter;
      const response = await api.getInvitations(pagination.page, pagination.limit, status);
      setInvitations(response.invitations);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar convites');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Remove empty strings and convert to undefined, but keep required fields
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === '' ? undefined : value
        ])
      );

      // Ensure required fields are present
      const invitationData: CreateInvitationData = {
        email: cleanedData.email || '',
        expiresAt: cleanedData.expiresAt || '',
      };

      await api.createInvitation(invitationData);
      setSuccess('Convite criado com sucesso!');
      setShowCreateForm(false);
      setFormData({
        email: '',
        name: '',
        position: '',
        department: '',
        expiresAt: '',
      });
      loadInvitations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar convite');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: number) => {
    if (!confirm('Tem certeza que deseja cancelar este convite?')) {
      return;
    }

    try {
      setLoading(true);
      await api.cancelInvitation(invitationId);
      setSuccess('Convite cancelado com sucesso!');
      loadInvitations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar convite');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.isUsed) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Usado
        </span>
      );
    }
    
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Expirado
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        Ativo
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmGrey-50 to-warmGrey-100">
      <ManagerNavbar />
      
      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-warmGrey-900 mb-2">
                <span className="gradient-text">Gestão de Convites</span>
              </h1>
              <p className="text-warmGrey-700">Crie e gerencie convites para funcionários</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Convite
            </button>
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

          {/* Filters */}
          <div className="glass-container p-6 mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-warmGrey-700">Filtrar por status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input w-48"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="used">Usados</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
          </div>

          {/* Create Invitation Form */}
          {showCreateForm && (
            <div className="glass-container p-8 mb-6">
              <h2 className="text-xl font-bold text-warmGrey-900 mb-6">Criar Novo Convite</h2>
              
              <form onSubmit={handleCreateInvitation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="funcionario@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="label">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Nome do funcionário"
                    />
                  </div>

                  <div>
                    <label className="label">Cargo</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Desenvolvedor, Analista, etc."
                    />
                  </div>

                  <div>
                    <label className="label">Departamento</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="TI, RH, Vendas, etc."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Data de Expiração</label>
                    <input
                      type="datetime-local"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <p className="text-xs text-warmGrey-600 mt-1">Deixe em branco para expirar em 7 dias</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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
                      'Criar Convite'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Invitations List */}
          <div className="glass-container p-8">
            <h2 className="text-xl font-bold text-warmGrey-900 mb-6">Convites Enviados</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-warmGrey-700">Carregando convites...</p>
              </div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-warmGrey-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-warmGrey-900 mb-2">Nenhum convite encontrado</h3>
                <p className="text-warmGrey-600 mb-4">Crie seu primeiro convite para começar a adicionar funcionários.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Criar Primeiro Convite
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="border border-warmGrey-200 rounded-xl p-6 hover:bg-warmGrey-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-warmGrey-900">
                            {invitation.name || invitation.email}
                          </h3>
                          {getStatusBadge(invitation)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-warmGrey-600">
                          <div>
                            <span className="font-medium">Email:</span> {invitation.email}
                          </div>
                          {invitation.position && (
                            <div>
                              <span className="font-medium">Cargo:</span> {invitation.position}
                            </div>
                          )}
                          {invitation.department && (
                            <div>
                              <span className="font-medium">Departamento:</span> {invitation.department}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Código:</span> 
                            <code className="ml-1 px-2 py-1 bg-warmGrey-100 rounded text-xs font-mono">
                              {invitation.code}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium">Criado em:</span> {formatDate(invitation.createdAt)}
                          </div>
                          {invitation.expiresAt && (
                            <div>
                              <span className="font-medium">Expira em:</span> {formatDate(invitation.expiresAt)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!invitation.isUsed && invitation.expiresAt && new Date(invitation.expiresAt) > new Date() && (
                          <button
                            onClick={() => handleCancelInvitation(invitation.id)}
                            className="btn-secondary text-sm"
                            disabled={loading}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-warmGrey-200">
                <div className="text-sm text-warmGrey-600">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} convites
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1 || loading}
                    className="btn-secondary text-sm"
                  >
                    Anterior
                  </button>
                  
                  <span className="text-sm text-warmGrey-600">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className="btn-secondary text-sm"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}