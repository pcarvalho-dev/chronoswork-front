'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, TimeLogReportResponse, UsersResponse } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';
import ManagerNavbar from '../components/ManagerNavbar';

export default function ManagerDashboard() {
  const { user, isManager, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalHoursToday: 0,
  });
  const [recentTimeLogs, setRecentTimeLogs] = useState<any[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Redirect if not manager
  useEffect(() => {
    if (!isManager) {
      router.push('/login');
    }
  }, [isManager, router]);

  useEffect(() => {
    if (isManager) {
      fetchDashboardData();
    }
  }, [isManager]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Initialize with default values
      let stats = {
        totalUsers: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        totalHoursToday: 0,
      };

      let recentTimeLogs: any[] = [];

      // Try to fetch company data (this should work for managers)
      try {
        const companyData = await api.getCompany();
        if (companyData && companyData.company) {
          // If we have company data, we can show some basic info
          stats.totalUsers = 1; // At least the manager
          console.log('Company data loaded successfully');
        }
      } catch (companyErr: any) {
        console.warn('Failed to fetch company data:', companyErr);
        // If company not found, it might mean the manager hasn't set up their company yet
        if (companyErr.message?.includes('Empresa não encontrada')) {
          console.log('Company not set up yet - this is normal for new managers');
        }
      }

      // Try to fetch invitations (this should work for managers)
      try {
        const invitationsData = await api.getInvitations(1, 10);
        if (invitationsData && invitationsData.invitations) {
          stats.pendingApprovals = invitationsData.invitations.filter(inv => 
            !inv.isUsed && inv.isActive
          ).length;
          console.log('Invitations data loaded successfully');
        }
      } catch (invitationsErr: any) {
        console.warn('Failed to fetch invitations:', invitationsErr);
        if (invitationsErr.message?.includes('não encontrado') || invitationsErr.message?.includes('not found')) {
          console.log('Invitations endpoint not available yet');
        }
      }

      // Try to fetch pending employees (this should work for managers)
      try {
        const pendingEmployeesData = await api.getPendingEmployees(1, 10);
        if (pendingEmployeesData && pendingEmployeesData.users) {
          stats.pendingApprovals = pendingEmployeesData.users.length + stats.pendingApprovals;
          console.log('Pending employees data loaded successfully');
        }
      } catch (pendingErr: any) {
        console.warn('Failed to fetch pending employees:', pendingErr);
        if (pendingErr.message?.includes('não encontrado') || pendingErr.message?.includes('not found')) {
          console.log('Pending employees endpoint not available yet');
        }
      }

      setStats(stats);
      setRecentTimeLogs(recentTimeLogs);
      
      // Check if we need to show a setup message
      if (stats.totalUsers === 0 && stats.pendingApprovals === 0) {
        setError('Configure sua empresa para começar a gerenciar funcionários. Acesse a página de configurações da empresa.');
      }
      
      console.log('Dashboard loaded successfully');
      
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError('Falha ao carregar dados do dashboard. Alguns dados podem não estar disponíveis.');
      
      // Set default stats if everything fails
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        totalHoursToday: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    }
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

  if (!isManager) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Header */}
      <ManagerNavbar />

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="gradient-text">Painel de Gestão</span>
            </h1>
            <p className="text-warmGrey-700 font-medium">Gerencie usuários e pontos da equipe</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/manager/users/new')}
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Usuário
            </button>
            <button
              onClick={() => router.push('/manager/time-logs/manual')}
              className="btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lançar Ponto
            </button>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Total de Usuários</h3>
                <p className="text-warmGrey-600 text-sm">Cadastrados no sistema</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : stats.totalUsers}
            </div>
          </div>

          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Usuários Ativos</h3>
                <p className="text-warmGrey-600 text-sm">Atualmente ativos</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : stats.activeUsers}
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
              {loading ? '...' : stats.pendingApprovals}
            </div>
          </div>

          <div className="glass-container p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Horas Hoje</h3>
                <p className="text-warmGrey-600 text-sm">Total trabalhado</p>
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {loading ? '...' : `${stats.totalHoursToday}h`}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-container p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-warmGrey-900">Gestão de Usuários</h2>
                <p className="text-warmGrey-600 text-sm">Gerencie funcionários e gestores</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/manager/users')}
                className="w-full btn-secondary text-left justify-start"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Listar Usuários
              </button>
              <button
                onClick={() => router.push('/manager/users/new')}
                className="w-full btn-primary text-left justify-start"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Novo Usuário
              </button>
            </div>
          </div>

          <div className="glass-container p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-warmGrey-900">Gestão de Pontos</h2>
                <p className="text-warmGrey-600 text-sm">Controle de horas e aprovações</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/manager/time-logs')}
                className="w-full btn-secondary text-left justify-start"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Relatórios de Pontos
              </button>
              <button
                onClick={() => router.push('/manager/time-logs/pending')}
                className="w-full btn-primary text-left justify-start"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Aprovar Pontos
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-container p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-warmGrey-900">Atividade Recente</h2>
              <p className="text-warmGrey-600 text-sm">Últimos registros de ponto</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 mx-auto text-primary-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-warmGrey-600 font-medium">Carregando...</p>
            </div>
          ) : recentTimeLogs.length === 0 ? (
            <div className="text-center py-12 bg-warmGrey-100/50 backdrop-blur-sm border border-warmGrey-200/50 rounded-xl">
              <svg className="w-20 h-20 mx-auto mb-4 text-warmGrey-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-warmGrey-700 font-medium text-lg">Nenhuma atividade recente</p>
              <p className="text-warmGrey-600 text-sm mt-1">Os registros de ponto aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTimeLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-5 hover:bg-white/60 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {log.checkOut ? (
                          <div className="badge bg-green-500/20 text-green-700 border-green-500/30">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Concluída
                          </div>
                        ) : (
                          <div className="badge bg-blue-500/20 text-blue-700 border-blue-500/30 animate-pulse">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            Ativa
                          </div>
                        )}
                        {log.user && (
                          <span className="text-sm text-warmGrey-600">
                            {log.user.name}
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