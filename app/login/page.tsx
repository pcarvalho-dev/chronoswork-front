'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InteractiveBackground from '@/app/components/InteractiveBackground';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <InteractiveBackground />

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="Chronos.work"
            width={1100}
            height={300}
            className="h-60 w-auto drop-shadow-lg"
          />
        </Link>

        {/* Login Card */}
        <div className="glass-container p-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Bem-vindo de volta</span>
          </h1>
          <p className="text-warmGrey-700 font-medium mb-8">Entre na sua conta para continuar</p>

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                className="input"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm gradient-text font-medium hover:opacity-80 transition-opacity">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary w-full text-lg py-4"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-warmGrey-700">Não tem uma conta? </span>
            <Link href="/register" className="gradient-text font-semibold hover:opacity-80 transition-opacity">
              Cadastre-se
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-warmGrey-700 hover:text-warmGrey-900 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white/20 backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
