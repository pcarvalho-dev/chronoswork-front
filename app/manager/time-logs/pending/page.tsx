'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, TimeLogsResponse } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';

export default function PendingTimeLogsPage() {
  const { isManager } = useAuth();
  const router = useRouter();
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [showApprovalModal, setShowApprovalModal] = useState<number | null>(null);
  const [approvalData, setApprovalData] = useState({
    approved: true,
    rejectionReason: '',
  });
  const [processing, setProcessing] = useState(false);

  // Redirect if not manager
  useEffect(() => {
    if (!isManager) {
      router.push('/login');
    }
  }, [isManager, router]);

  useEffect(() => {
    if (isManager) {
      fetchPendingTimeLogs();
    }
  }, [isManager, pagination.page]);

  const fetchPendingTimeLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.getPendingTimeLogs(pagination.page, pagination.limit);
      setTimeLogs(response.timeLogs);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar pontos pendentes');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (timeLogId: number) => {
    try {
      setProcessing(true);
      await api.approveTimeLog(
        timeLogId,
        approvalData.approved,
        approvalData.approved ? undefined : approvalData.rejectionReason
      );
      setShowApprovalModal(null);
      setApprovalData({ approved: true, rejectionReason: '' });
      await fetchPendingTimeLogs(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Falha ao processar aprovação');
    } finally {
      setProcessing(false);
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
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-navbar">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/manager/time-logs')}
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
            <span className="gradient-text">Aprovação de Pontos</span>
          </h1>
          <p className="text-warmGrey-700 font-medium">Aprove ou rejeite lançamentos manuais pendentes</p>
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

        {/* Pending Time Logs List */}
        <div className="glass-container p-8">
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 mx-auto text-primary-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-warmGrey-600 font-medium">Carregando pontos pendentes...</p>
            </div>
          ) : timeLogs.length === 0 ? (
            <div className="text-center py-12 bg-warmGrey-100/50 backdrop-blur-sm border border-warmGrey-200/50 rounded-xl">
              <svg className="w-20 h-20 mx-auto mb-4 text-warmGrey-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-warmGrey-700 font-medium text-lg">Nenhum ponto pendente</p>
              <p className="text-warmGrey-600 text-sm mt-1">Todos os lançamentos manuais foram processados</p>
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
                        <div className="badge bg-orange-500/20 text-orange-700 border-orange-500/30">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pendente
                        </div>
                        {log.user && (
                          <span className="text-sm text-warmGrey-600">
                            {log.user.name}
                          </span>
                        )}
                        <span className="text-xs text-warmGrey-500 bg-warmGrey-100 px-2 py-1 rounded-full">
                          Manual
                        </span>
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
                          <span>{formatDate(log.checkOut)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-warmGrey-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="font-medium">Motivo:</span>
                          <span>{log.reason}</span>
                        </div>
                        {log.checkInLocation && (
                          <div className="flex items-center gap-2 text-warmGrey-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Local de Entrada:</span>
                            <span>{log.checkInLocation}</span>
                          </div>
                        )}
                        {log.checkOutLocation && (
                          <div className="flex items-center gap-2 text-warmGrey-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Local de Saída:</span>
                            <span>{log.checkOutLocation}</span>
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
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/30">
                    <button
                      onClick={() => {
                        setApprovalData({ approved: true, rejectionReason: '' });
                        setShowApprovalModal(log.id);
                      }}
                      className="btn-primary text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Aprovar
                    </button>
                    <button
                      onClick={() => {
                        setApprovalData({ approved: false, rejectionReason: '' });
                        setShowApprovalModal(log.id);
                      }}
                      className="btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/30">
              <div className="text-sm text-warmGrey-600">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} pontos
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

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-container p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                approvalData.approved ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {approvalData.approved ? (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-bold text-warmGrey-900 mb-2">
                {approvalData.approved ? 'Aprovar Lançamento' : 'Rejeitar Lançamento'}
              </h3>
              <p className="text-warmGrey-600">
                {approvalData.approved 
                  ? 'Tem certeza que deseja aprovar este lançamento manual?'
                  : 'Tem certeza que deseja rejeitar este lançamento manual?'
                }
              </p>
            </div>

            {!approvalData.approved && (
              <div className="mb-6">
                <label htmlFor="rejectionReason" className="label">
                  Motivo da Rejeição *
                </label>
                <textarea
                  id="rejectionReason"
                  value={approvalData.rejectionReason}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                  className="input"
                  rows={3}
                  placeholder="Explique o motivo da rejeição..."
                  required
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(null)}
                className="btn-secondary flex-1"
                disabled={processing}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleApproval(showApprovalModal)}
                disabled={processing || (!approvalData.approved && !approvalData.rejectionReason)}
                className={`btn-primary flex-1 ${
                  !approvalData.approved ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
              >
                {processing ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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