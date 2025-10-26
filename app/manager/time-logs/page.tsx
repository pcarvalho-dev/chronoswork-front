'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, TimeLogReportResponse, User } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';

export default function TimeLogsPage() {
  const { isManager } = useAuth();
  const router = useRouter();
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    totalApproved: 0,
    totalPending: 0,
    totalRejected: 0,
    totalHoursWorked: 0,
    averageHoursPerDay: 0,
  });
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    userId: '',
    department: '',
  });

  // Redirect if not manager
  useEffect(() => {
    if (!isManager) {
      router.push('/login');
    }
  }, [isManager, router]);

  useEffect(() => {
    if (isManager) {
      fetchUsers();
      fetchTimeLogs();
    }
  }, [isManager]);

  const fetchUsers = async () => {
    try {
      // Try to fetch users, but don't fail if endpoint doesn't exist
      let usersData: User[] = [];
      
      try {
        const response = await api.getUsers(1, 100);
        usersData = response.users || [];
      } catch (usersErr) {
        console.warn('Failed to fetch users:', usersErr);
        // Try alternative approach - get pending employees
        try {
          const pendingResponse = await api.getPendingEmployees(1, 100);
          usersData = pendingResponse.users || [];
        } catch (pendingErr) {
          console.warn('Failed to fetch pending employees:', pendingErr);
          // Set empty array as fallback
          usersData = [];
        }
      }
      
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setUsers([]);
    }
  };

  const fetchTimeLogs = async () => {
    try {
      setLoading(true);
      setError('');

      // Try to fetch time logs, but don't fail if endpoint doesn't exist
      let timeLogsData: any[] = [];
      let statisticsData = {
        totalApproved: 0,
        totalPending: 0,
        totalRejected: 0,
        totalHoursWorked: 0,
        averageHoursPerDay: 0,
      };
      
      try {
        // Try to get time logs using the basic endpoint
        timeLogsData = await api.getTimeLogs(
          filters.startDate,
          filters.endDate
        );
        
        // Calculate basic statistics from the data
        statisticsData = {
          totalApproved: timeLogsData.filter(log => log.status === 'approved').length,
          totalPending: timeLogsData.filter(log => log.status === 'pending').length,
          totalRejected: timeLogsData.filter(log => log.status === 'rejected').length,
          totalHoursWorked: timeLogsData.reduce((total, log) => {
            if (log.checkOut) {
              const start = new Date(log.checkIn).getTime();
              const end = new Date(log.checkOut).getTime();
              const hours = (end - start) / (1000 * 60 * 60);
              return total + hours;
            }
            return total;
          }, 0),
          averageHoursPerDay: 0, // Will be calculated if needed
        };
        
        // Calculate average hours per day
        const days = Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1;
        statisticsData.averageHoursPerDay = statisticsData.totalHoursWorked / days;
        
      } catch (timeLogsErr) {
        console.warn('Failed to fetch time logs:', timeLogsErr);
        // Set empty data as fallback
        timeLogsData = [];
        statisticsData = {
          totalApproved: 0,
          totalPending: 0,
          totalRejected: 0,
          totalHoursWorked: 0,
          averageHoursPerDay: 0,
        };
      }

      setTimeLogs(timeLogsData);
      setStatistics(statisticsData);
      
      if (timeLogsData.length === 0) {
        setError('Nenhum registro de ponto encontrado. Verifique os filtros ou se há registros no período selecionado.');
      }
    } catch (err: any) {
      console.error('Error fetching time logs:', err);
      setError('Falha ao carregar relatório de pontos. Verifique sua conexão e tente novamente.');
      setTimeLogs([]);
      setStatistics({
        totalApproved: 0,
        totalPending: 0,
        totalRejected: 0,
        totalHoursWorked: 0,
        averageHoursPerDay: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    const start = new Date(checkIn).getTime();
    const end = checkOut ? new Date(checkOut).getTime() : Date.now();
    const durationMs = end - start;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (timeLog: any) => {
    if (timeLog.isManual) {
      if (timeLog.status === 'approved') {
        return (
          <div className="badge bg-green-500/20 text-green-700 border-green-500/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Aprovado
          </div>
        );
      } else if (timeLog.status === 'rejected') {
        return (
          <div className="badge bg-red-500/20 text-red-700 border-red-500/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Rejeitado
          </div>
        );
      } else {
        return (
          <div className="badge bg-orange-500/20 text-orange-700 border-orange-500/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Pendente
          </div>
        );
      }
    } else {
      return (
        <div className="badge bg-blue-500/20 text-blue-700 border-blue-500/30">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Automático
        </div>
      );
    }
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
                onClick={() => router.push('/manager/time-logs/manual')}
                className="btn-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Lançar Ponto
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="gradient-text">Relatórios de Pontos</span>
          </h1>
          <p className="text-warmGrey-700 font-medium">Gerencie e analise os registros de ponto da equipe</p>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Aprovados</h3>
                <p className="text-warmGrey-600 text-sm">Pontos aprovados</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : statistics.totalApproved}
            </div>
          </div>

          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Pendentes</h3>
                <p className="text-warmGrey-600 text-sm">Aguardando aprovação</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : statistics.totalPending}
            </div>
          </div>

          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Rejeitados</h3>
                <p className="text-warmGrey-600 text-sm">Pontos rejeitados</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : statistics.totalRejected}
            </div>
          </div>

          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Total Horas</h3>
                <p className="text-warmGrey-600 text-sm">Horas trabalhadas</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : `${statistics.totalHoursWorked}h`}
            </div>
          </div>

          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Média/Dia</h3>
                <p className="text-warmGrey-600 text-sm">Horas por dia</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : `${statistics.averageHoursPerDay.toFixed(1)}h`}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-container p-6 mb-8">
          <h2 className="text-xl font-bold text-warmGrey-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="startDate" className="label">
                Data Inicial
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="label">
                Data Final
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="userId" className="label">
                Funcionário
              </label>
              <select
                id="userId"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">Todos os funcionários</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="department" className="label">
                Departamento
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="input"
                placeholder="Ex: TI, RH, Vendas"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={fetchTimeLogs}
              disabled={loading}
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Aplicar Filtros
            </button>
            <button
              onClick={() => {
                setFilters({
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  userId: '',
                  department: '',
                });
              }}
              className="btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar
            </button>
          </div>
        </div>

        {/* Time Logs List */}
        <div className="glass-container p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-warmGrey-900">Registros de Ponto</h2>
            <button
              onClick={() => router.push('/manager/time-logs/pending')}
              className="btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aprovar Pontos
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 mx-auto text-primary-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-warmGrey-600 font-medium">Carregando registros...</p>
            </div>
          ) : timeLogs.length === 0 ? (
            <div className="text-center py-12 bg-warmGrey-100/50 backdrop-blur-sm border border-warmGrey-200/50 rounded-xl">
              <svg className="w-20 h-20 mx-auto mb-4 text-warmGrey-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-warmGrey-700 font-medium text-lg">Nenhum registro encontrado</p>
              <p className="text-warmGrey-600 text-sm mt-1">Ajuste os filtros para ver os registros</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/60 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusBadge(log)}
                        {log.user && (
                          <span className="text-sm text-warmGrey-600">
                            {log.user.name}
                          </span>
                        )}
                        {log.isManual && (
                          <span className="text-xs text-warmGrey-500 bg-warmGrey-100 px-2 py-1 rounded-full">
                            Manual
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-warmGrey-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Entrada:</span>
                          <span>{formatDate(log.checkIn)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-warmGrey-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Saída:</span>
                          <span>{log.checkOut ? formatDate(log.checkOut) : 'Em andamento...'}</span>
                        </div>
                        {log.isManual && log.reason && (
                          <div className="flex items-center gap-2 text-warmGrey-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span className="font-medium">Motivo:</span>
                            <span>{log.reason}</span>
                          </div>
                        )}
                        {log.isManual && log.approver && (
                          <div className="flex items-center gap-2 text-warmGrey-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">Aprovado por:</span>
                            <span>{log.approver.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-warmGrey-600 mb-1">Duração</p>
                      <div className="text-2xl font-bold gradient-text">
                        {calculateDuration(log.checkIn, log.checkOut)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}