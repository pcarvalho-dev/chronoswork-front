'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { api, User } from '@/app/lib/api';
import ManagerNavbar from '@/app/components/ManagerNavbar';

export default function EmployeeApprovalPage() {
  const { user, isManager } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approved: true,
    notes: '',
  });

  useEffect(() => {
    if (isManager) {
      loadEmployees();
    }
  }, [isManager, pagination.page, statusFilter, searchTerm]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const search = searchTerm || undefined;
      const status = statusFilter === 'all' ? undefined : statusFilter;
      const response = await api.getPendingEmployees(pagination.page, pagination.limit, search);
      setEmployees(response.users);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadEmployees();
  };

  const handleApproveEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setApprovalData({ approved: true, notes: '' });
    setShowApprovalModal(true);
  };

  const handleRejectEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setApprovalData({ approved: false, notes: '' });
    setShowApprovalModal(true);
  };

  const handleSubmitApproval = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);
      await api.approveEmployee(selectedEmployee.id, approvalData.approved, approvalData.notes);
      setSuccess(`Funcionário ${approvalData.approved ? 'aprovado' : 'rejeitado'} com sucesso!`);
      setShowApprovalModal(false);
      setSelectedEmployee(null);
      loadEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar aprovação');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (employee: User) => {
    if (!employee.isApproved) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pendente
        </span>
      );
    }
    
    if (employee.isActive) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Aprovado
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Rejeitado
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-warmGrey-900 mb-2">
              <span className="gradient-text">Aprovação de Funcionários</span>
            </h1>
            <p className="text-warmGrey-700">Aprove ou rejeite funcionários que se cadastraram</p>
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

          {/* Filters and Search */}
          <div className="glass-container p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou email..."
                    className="input flex-1"
                  />
                  <button type="submit" className="btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input w-48"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </div>
          </div>

          {/* Employees List */}
          <div className="glass-container p-8">
            <h2 className="text-xl font-bold text-warmGrey-900 mb-6">Funcionários</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-warmGrey-700">Carregando funcionários...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-warmGrey-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="text-lg font-medium text-warmGrey-900 mb-2">Nenhum funcionário encontrado</h3>
                <p className="text-warmGrey-600">Não há funcionários para aprovar no momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border border-warmGrey-200 rounded-xl p-6 hover:bg-warmGrey-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-warmGrey-900">
                            {employee.name}
                          </h3>
                          {getStatusBadge(employee)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-warmGrey-600">
                          <div>
                            <span className="font-medium">Email:</span> {employee.email}
                          </div>
                          {employee.position && (
                            <div>
                              <span className="font-medium">Cargo:</span> {employee.position}
                            </div>
                          )}
                          {employee.department && (
                            <div>
                              <span className="font-medium">Departamento:</span> {employee.department}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Cadastrado em:</span> {formatDate(employee.createdAt || '')}
                          </div>
                          {employee.employeeId && (
                            <div>
                              <span className="font-medium">ID:</span> {employee.employeeId}
                            </div>
                          )}
                          {employee.phone && (
                            <div>
                              <span className="font-medium">Telefone:</span> {employee.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!employee.isApproved && (
                          <>
                            <button
                              onClick={() => handleApproveEmployee(employee)}
                              className="btn-primary text-sm"
                              disabled={loading}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleRejectEmployee(employee)}
                              className="btn-secondary text-sm"
                              disabled={loading}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Rejeitar
                            </button>
                          </>
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
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} funcionários
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

      {/* Approval Modal */}
      {showApprovalModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-container p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-warmGrey-900 mb-4">
              {approvalData.approved ? 'Aprovar' : 'Rejeitar'} Funcionário
            </h3>
            
            <div className="mb-4">
              <p className="text-warmGrey-700 mb-2">
                <strong>Funcionário:</strong> {selectedEmployee.name}
              </p>
              <p className="text-warmGrey-700">
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
            </div>

            <div className="mb-6">
              <label className="label">
                Observações {!approvalData.approved && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={approvalData.notes}
                onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
                className="input min-h-[100px] resize-y"
                placeholder={approvalData.approved ? "Observações sobre a aprovação (opcional)" : "Motivo da rejeição"}
                required={!approvalData.approved}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitApproval}
                className={`flex-1 ${approvalData.approved ? 'btn-primary' : 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'}`}
                disabled={loading || (!approvalData.approved && !approvalData.notes.trim())}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  approvalData.approved ? 'Aprovar' : 'Rejeitar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}