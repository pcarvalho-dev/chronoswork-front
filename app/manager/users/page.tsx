'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, User, UsersResponse } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';

export default function UsersPage() {
  const { isManager } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Redirect if not manager
  useEffect(() => {
    if (!isManager) {
      router.push('/login');
    }
  }, [isManager, router]);

  useEffect(() => {
    if (isManager) {
      fetchUsers();
    }
  }, [isManager, pagination.page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      // Try to fetch users, but don't fail if endpoint doesn't exist
      let usersData: User[] = [];
      let paginationData = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
      
      try {
        const response = await api.getUsers(
          pagination.page,
          pagination.limit,
          search || undefined,
          roleFilter || undefined
        );
        usersData = response.users || [];
        paginationData = response.pagination || paginationData;
      } catch (usersErr) {
        console.warn('Failed to fetch users:', usersErr);
        // Try alternative approach - get pending employees
        try {
          const pendingResponse = await api.getPendingEmployees(1, 100);
          usersData = pendingResponse.users || [];
          paginationData = {
            page: 1,
            limit: 100,
            total: usersData.length,
            totalPages: 1,
          };
        } catch (pendingErr) {
          console.warn('Failed to fetch pending employees:', pendingErr);
          // Set empty data as fallback
          usersData = [];
          paginationData = {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          };
        }
      }

      setUsers(usersData);
      setPagination(paginationData);
      
      if (usersData.length === 0) {
        setError('Nenhum usuário encontrado. Verifique se há usuários cadastrados.');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Falha ao carregar usuários. Verifique sua conexão e tente novamente.');
      setUsers([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      setDeleting(true);
      await api.deleteUser(userId);
      setShowDeleteModal(null);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Falha ao deletar usuário');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      await api.toggleUserStatus(userId);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Falha ao alterar status do usuário');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isManager) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-navbar">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/manager')}
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

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/manager/users/new')}
                className="btn-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Usuário
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="gradient-text">Gestão de Usuários</span>
            </h1>
            <p className="text-warmGrey-700 font-medium">Gerencie funcionários e gestores</p>
          </div>
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

        {/* Filters */}
        <div className="glass-container p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="label">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome ou email..."
                className="input"
              />
            </div>
            <div>
              <label htmlFor="role" className="label">
                Função
              </label>
              <select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input"
              >
                <option value="">Todas as funções</option>
                <option value="manager">Gestor</option>
                <option value="employee">Funcionário</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setRoleFilter('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="btn-secondary w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="glass-container p-8">
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 mx-auto text-primary-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-warmGrey-600 font-medium">Carregando usuários...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 bg-warmGrey-100/50 backdrop-blur-sm border border-warmGrey-200/50 rounded-xl">
              <svg className="w-20 h-20 mx-auto mb-4 text-warmGrey-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-warmGrey-700 font-medium text-lg">Nenhum usuário encontrado</p>
              <p className="text-warmGrey-600 text-sm mt-1">Crie o primeiro usuário para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/60 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/50">
                        {user.profilePhoto ? (
                          <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-warmGrey-900">{user.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'manager' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role === 'manager' ? 'Gestor' : 'Funcionário'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-warmGrey-600 text-sm">{user.email}</p>
                        {user.department && (
                          <p className="text-warmGrey-500 text-sm">{user.department} • {user.position}</p>
                        )}
                        <p className="text-warmGrey-500 text-xs">
                          Criado em {formatDate(user.createdAt || '')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/manager/users/${user.id}`)}
                        className="btn-ghost text-sm"
                        title="Ver detalhes"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => router.push(`/manager/users/${user.id}/edit`)}
                        className="btn-ghost text-sm"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`btn-ghost text-sm ${
                          user.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'
                        }`}
                        title={user.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {user.isActive ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(user.id)}
                        className="btn-ghost text-sm text-red-600 hover:text-red-700"
                        title="Deletar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/30">
              <div className="text-sm text-warmGrey-600">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} usuários
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-warmGrey-600">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-container p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-warmGrey-900 mb-2">Confirmar Exclusão</h3>
              <p className="text-warmGrey-600 mb-6">
                Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="btn-secondary flex-1"
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteModal)}
                  disabled={deleting}
                  className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    'Deletar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}