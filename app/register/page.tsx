'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import InteractiveBackground from '../components/InteractiveBackground';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação
    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Login automático após registro
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Falha no cadastro. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error('Erro no cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-warmGrey-50 px-4 py-12 relative overflow-hidden">
      <InteractiveBackground />
      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="Chronos.work"
            width={1100}
            height={300}
            className="h-60 w-auto"
          />
        </Link>

        {/* Register Card */}
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-warmGrey-900 mb-2">Criar uma conta</h1>
          <p className="text-warmGrey-600 mb-8">Comece a rastrear seu tempo hoje</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="label">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                required
                className="input"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

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
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-warmGrey-600">Já tem uma conta? </span>
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
