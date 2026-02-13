'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ManagerNavbar from '@/app/components/ManagerNavbar';
import InteractiveBackground from '@/app/components/InteractiveBackground';
import { api, User, TimeLog } from '@/app/lib/api';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string);

  const [user, setUser] = useState<User | null>(null);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLogsPage, setTimeLogsPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUserData();
    loadTimeLogs();
  }, [userId, timeLogsPage]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await api.getUserById(userId);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuário');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeLogs = async () => {
    try {
      const response = await api.getUserTimeLogs(userId, timeLogsPage, 10);
      setTimeLogs(response.timeLogs);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error('Erro ao carregar registros de ponto:', err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return 'Em andamento';
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warmGrey-50 to-warmGrey-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-warmGrey-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warmGrey-50 to-warmGrey-100 flex items-center justify-center">
        <div className="card p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-warmGrey-900 mb-2">Erro</h2>
          <p className="text-warmGrey-600 mb-6">{error || 'Usuário não encontrado'}</p>
          <button onClick={() => router.push('/manager/users')} className="btn-primary">
            Voltar para Usuários
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      <ManagerNavbar />

      <div className="container-custom py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="btn-ghost"
              type="button"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-warmGrey-900">Detalhes do Usuário</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/manager/users/${userId}/edit`)}
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="card p-6 lg:sticky lg:top-20">
              <div className="text-center mb-6">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-500 to-cyan-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-warmGrey-900 mb-1">{user.name}</h2>
                <p className="text-warmGrey-600 mb-2">{user.email}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'manager'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'manager' ? 'Gestor' : 'Funcionário'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              {user.department && (
                <div className="border-t border-warmGrey-200 pt-4 mt-4">
                  <p className="text-sm text-warmGrey-600 mb-1">Departamento</p>
                  <p className="font-semibold text-warmGrey-900">{user.department}</p>
                </div>
              )}

              {user.position && (
                <div className="border-t border-warmGrey-200 pt-4 mt-4">
                  <p className="text-sm text-warmGrey-600 mb-1">Cargo</p>
                  <p className="font-semibold text-warmGrey-900">{user.position}</p>
                </div>
              )}

              {user.employeeId && (
                <div className="border-t border-warmGrey-200 pt-4 mt-4">
                  <p className="text-sm text-warmGrey-600 mb-1">Matrícula</p>
                  <p className="font-semibold text-warmGrey-900">{user.employeeId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Tabs */}
          <div className="flex-1">
            {/* Personal Information */}
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-bold text-warmGrey-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Informações Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">CPF</p>
                  <p className="font-semibold text-warmGrey-900">{user.cpf || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">RG</p>
                  <p className="font-semibold text-warmGrey-900">{user.rg || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Data de Nascimento</p>
                  <p className="font-semibold text-warmGrey-900">{formatDate(user.birthDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Gênero</p>
                  <p className="font-semibold text-warmGrey-900">{user.gender || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Estado Civil</p>
                  <p className="font-semibold text-warmGrey-900">{user.maritalStatus || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Telefone</p>
                  <p className="font-semibold text-warmGrey-900">{user.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Celular</p>
                  <p className="font-semibold text-warmGrey-900">{user.mobilePhone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-bold text-warmGrey-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Endereço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-warmGrey-600 mb-1">Logradouro</p>
                  <p className="font-semibold text-warmGrey-900">{user.address || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Número</p>
                  <p className="font-semibold text-warmGrey-900">{user.addressNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Complemento</p>
                  <p className="font-semibold text-warmGrey-900">{user.addressComplement || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Bairro</p>
                  <p className="font-semibold text-warmGrey-900">{user.neighborhood || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">CEP</p>
                  <p className="font-semibold text-warmGrey-900">{user.zipCode || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Cidade</p>
                  <p className="font-semibold text-warmGrey-900">{user.city || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Estado</p>
                  <p className="font-semibold text-warmGrey-900">{user.state || '-'}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-bold text-warmGrey-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Informações Profissionais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Data de Admissão</p>
                  <p className="font-semibold text-warmGrey-900">{formatDate(user.hireDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Tipo de Contrato</p>
                  <p className="font-semibold text-warmGrey-900">{user.employmentType || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Horário de Trabalho</p>
                  <p className="font-semibold text-warmGrey-900">{user.workSchedule || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-warmGrey-600 mb-1">Supervisor Direto</p>
                  <p className="font-semibold text-warmGrey-900">{user.directSupervisor || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Logs History */}
        <div className="card p-6 mt-8">
          <h3 className="text-xl font-bold text-warmGrey-900 mb-4 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Histórico de Pontos
          </h3>

          {timeLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-warmGrey-600">Nenhum registro de ponto encontrado.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warmGrey-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-warmGrey-700">Entrada</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-warmGrey-700">Saída</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-warmGrey-700">Duração</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-warmGrey-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeLogs.map((log) => (
                      <tr key={log.id} className="border-b border-warmGrey-100 hover:bg-warmGrey-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-warmGrey-900">{formatDateTime(log.checkIn)}</td>
                        <td className="py-3 px-4 text-sm text-warmGrey-900">{log.checkOut ? formatDateTime(log.checkOut) : '-'}</td>
                        <td className="py-3 px-4 text-sm text-warmGrey-900">{calculateDuration(log.checkIn, log.checkOut)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.checkOut
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {log.checkOut ? 'Finalizado' : 'Em andamento'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setTimeLogsPage(Math.max(1, timeLogsPage - 1))}
                    disabled={timeLogsPage === 1}
                    className="btn-ghost text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                  <span className="text-sm text-warmGrey-700">
                    Página {timeLogsPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setTimeLogsPage(Math.min(totalPages, timeLogsPage + 1))}
                    disabled={timeLogsPage === totalPages}
                    className="btn-ghost text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
