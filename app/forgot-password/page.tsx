'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InteractiveBackground from '@/app/components/InteractiveBackground';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Um e-mail com instruções para redefinir sua senha foi enviado.');
        setEmail('');
      } else {
        setError(data.message || 'Erro ao enviar e-mail de recuperação.');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error('Erro ao solicitar recuperação de senha:', err);
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

        {/* Forgot Password Card */}
        <div className="glass-container p-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Esqueceu a senha?</span>
          </h1>
          <p className="text-warmGrey-700 font-medium mb-8">
            Digite seu e-mail e enviaremos instruções para redefinir sua senha
          </p>

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
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{success}</span>
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
                disabled={loading || !!success}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full text-lg py-4"
              disabled={loading || !!success}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar instruções'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <span className="text-warmGrey-700">Lembrou a senha? </span>
              <Link href="/login" className="gradient-text font-semibold hover:opacity-80 transition-opacity">
                Entrar
              </Link>
            </div>
            <div>
              <span className="text-warmGrey-700">Não tem uma conta? </span>
              <Link href="/register" className="gradient-text font-semibold hover:opacity-80 transition-opacity">
                Cadastre-se
              </Link>
            </div>
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
