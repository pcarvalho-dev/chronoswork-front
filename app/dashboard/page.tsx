'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, TimeLog } from '../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSession, setCurrentSession] = useState<TimeLog | null>(null);

  useEffect(() => {
    fetchTimeLogs();
  }, []);

  const fetchTimeLogs = async () => {
    try {
      const logs = await api.getTimeLogs();
      setTimeLogs(logs);

      // Verifica se há uma sessão ativa (sem horário de saída)
      const activeSession = logs.find(log => !log.checkOut);
      setCurrentSession(activeSession || null);

      setError('');
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar registros de tempo');
      // Se não autorizado, redireciona para login
      if (err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError('');

    try {
      await api.checkIn();
      await fetchTimeLogs();
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar entrada');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError('');

    try {
      await api.checkOut();
      await fetchTimeLogs();
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar saída');
    } finally {
      setActionLoading(false);
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

  const handleLogout = () => {
    // Limpa sessão e redireciona
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-warmGrey-50">
      {/* Header */}
      <nav className="bg-white border-b border-warmGrey-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-navbar">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Chronos.work"
                width={1200}
                height={320}
                className="h-60 w-auto"
              />
            </div>

            <button onClick={handleLogout} className="btn-ghost">
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold text-warmGrey-900 mb-8">Painel</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Check In/Out Card */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-semibold text-warmGrey-900 mb-6">Controle de Tempo</h2>

          {currentSession ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                <span className="font-medium">Sessão Ativa</span>
              </div>
              <div className="text-warmGrey-700">
                <p>Iniciado em: <span className="font-medium">{formatDate(currentSession.checkIn)}</span></p>
                <p className="mt-2">Duração: <span className="font-medium">{calculateDuration(currentSession.checkIn, null)}</span></p>
              </div>
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="btn-secondary"
              >
                {actionLoading ? 'Registrando saída...' : 'Registrar Saída'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-warmGrey-600">Nenhuma sessão ativa. Clique no botão abaixo para começar a rastrear seu tempo.</p>
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="btn-primary"
              >
                {actionLoading ? 'Registrando entrada...' : 'Registrar Entrada'}
              </button>
            </div>
          )}
        </div>

        {/* Time Logs */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-warmGrey-900 mb-6">Histórico de Registros</h2>

          {loading ? (
            <div className="text-center py-8 text-warmGrey-600">Carregando...</div>
          ) : timeLogs.length === 0 ? (
            <div className="text-center py-8 text-warmGrey-600">
              Ainda não há registros. Faça check-in para começar a rastrear seu tempo!
            </div>
          ) : (
            <div className="space-y-4">
              {timeLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-warmGrey-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-primary-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium text-warmGrey-900">
                          {log.checkOut ? 'Sessão Concluída' : 'Sessão Ativa'}
                        </span>
                      </div>
                      <div className="text-sm text-warmGrey-600 space-y-1">
                        <p>Entrada: {formatDate(log.checkIn)}</p>
                        <p>Saída: {log.checkOut ? formatDate(log.checkOut) : 'Em andamento...'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary-600">
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
