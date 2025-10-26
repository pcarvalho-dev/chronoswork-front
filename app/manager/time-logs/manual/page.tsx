'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, ManualTimeLogData, User } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import InteractiveBackground from '@/app/components/InteractiveBackground';

export default function ManualTimeLogPage() {
  const { isManager } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<ManualTimeLogData>({
    userId: 0,
    checkIn: '',
    checkOut: '',
    reason: '',
    checkInLocation: '',
    checkOutLocation: '',
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
      
      // Filter for employees and active users
      const filteredUsers = usersData.filter(user => 
        user.role === 'employee' && user.isActive
      );
      
      setUsers(filteredUsers);
      
      if (filteredUsers.length === 0) {
        setError('Nenhum funcionário encontrado. Verifique se há funcionários cadastrados e aprovados.');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Falha ao carregar usuários. Verifique sua conexão e tente novamente.');
      setUsers([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'userId' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!formData.userId || !formData.checkIn || !formData.checkOut || !formData.reason) {
        setError('Todos os campos obrigatórios devem ser preenchidos');
        return;
      }

      // Validate dates
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      
      if (checkInDate >= checkOutDate) {
        setError('A data de entrada deve ser anterior à data de saída');
        return;
      }

      await api.createManualTimeLog(formData);
      router.push('/manager/time-logs');
    } catch (err: any) {
      setError(err.message || 'Falha ao lançar ponto manual');
    } finally {
      setLoading(false);
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-2">
              <span className="gradient-text">Lançamento Manual de Ponto</span>
            </h1>
            <p className="text-warmGrey-700 font-medium">Registre pontos manualmente para funcionários</p>
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Informações do Lançamento</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="userId" className="label">
                    Funcionário *
                  </label>
                  <select
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required
                    className="input"
                  >
                    <option value="">Selecione um funcionário</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.department || 'Sem departamento'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="checkIn" className="label">
                      Data e Hora de Entrada *
                    </label>
                    <input
                      type="datetime-local"
                      id="checkIn"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkOut" className="label">
                      Data e Hora de Saída *
                    </label>
                    <input
                      type="datetime-local"
                      id="checkOut"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="label">
                    Motivo do Lançamento Manual *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    className="input"
                    rows={3}
                    placeholder="Ex: Funcionário esqueceu de bater o ponto, problema técnico, etc."
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="glass-container p-8">
              <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Localização (Opcional)</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="checkInLocation" className="label">
                    Local de Entrada
                  </label>
                  <input
                    type="text"
                    id="checkInLocation"
                    name="checkInLocation"
                    value={formData.checkInLocation}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ex: Escritório Central, Home Office, Cliente XYZ"
                  />
                </div>

                <div>
                  <label htmlFor="checkOutLocation" className="label">
                    Local de Saída
                  </label>
                  <input
                    type="text"
                    id="checkOutLocation"
                    name="checkOutLocation"
                    value={formData.checkOutLocation}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ex: Escritório Central, Home Office, Cliente XYZ"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.userId && formData.checkIn && formData.checkOut && (
              <div className="glass-container p-8">
                <h2 className="text-2xl font-bold text-warmGrey-900 mb-6">Prévia do Lançamento</h2>
                <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-warmGrey-700">Funcionário:</span>
                      <span className="text-warmGrey-900">
                        {users.find(u => u.id === formData.userId)?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-warmGrey-700">Entrada:</span>
                      <span className="text-warmGrey-900">
                        {new Date(formData.checkIn).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-warmGrey-700">Saída:</span>
                      <span className="text-warmGrey-900">
                        {new Date(formData.checkOut).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-warmGrey-700">Duração:</span>
                      <span className="text-warmGrey-900 font-bold">
                        {(() => {
                          const start = new Date(formData.checkIn).getTime();
                          const end = new Date(formData.checkOut).getTime();
                          const durationMs = end - start;
                          const hours = Math.floor(durationMs / (1000 * 60 * 60));
                          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                          return `${hours}h ${minutes}m`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-warmGrey-700">Motivo:</span>
                      <span className="text-warmGrey-900">{formData.reason}</span>
                    </div>
                    {formData.checkInLocation && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-warmGrey-700">Local de Entrada:</span>
                        <span className="text-warmGrey-900">{formData.checkInLocation}</span>
                      </div>
                    )}
                    {formData.checkOutLocation && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-warmGrey-700">Local de Saída:</span>
                        <span className="text-warmGrey-900">{formData.checkOutLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push('/manager/time-logs')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Lançar Ponto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}