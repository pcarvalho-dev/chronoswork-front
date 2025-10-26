'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function ManagerNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  return (
    <nav className="bg-white/70 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-navbar">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/manager')}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <svg className="w-6 h-6 text-warmGrey-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push('/manager')}
              className="text-warmGrey-700 hover:text-primary-600 transition-colors font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/manager/company')}
              className="text-warmGrey-700 hover:text-primary-600 transition-colors font-medium"
            >
              Empresa
            </button>
            <button
              onClick={() => router.push('/manager/invitations')}
              className="text-warmGrey-700 hover:text-primary-600 transition-colors font-medium"
            >
              Convites
            </button>
            <button
              onClick={() => router.push('/manager/employees/approval')}
              className="text-warmGrey-700 hover:text-primary-600 transition-colors font-medium"
            >
              Aprovações
            </button>
            <button
              onClick={() => router.push('/manager/users')}
              className="text-warmGrey-700 hover:text-primary-600 transition-colors font-medium"
            >
              Usuários
            </button>
            <button
              onClick={() => router.push('/manager/time-logs')}
              className="text-warmGrey-700 hover:text-primary-600 transition-colors font-medium"
            >
              Pontos
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => router.push('/manager/invitations')}
                className="btn-ghost text-sm"
                title="Criar Convite"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/manager/users/new')}
                className="btn-ghost text-sm"
                title="Novo Usuário"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/manager/time-logs/manual')}
                className="btn-ghost text-sm"
                title="Lançar Ponto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 hover:border-primary-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 glass-container p-4 shadow-xl">
                  <div className="space-y-3">
                    <div className="text-center pb-3 border-b border-warmGrey-200">
                      <p className="font-semibold text-warmGrey-900">{user?.name}</p>
                      <p className="text-sm text-warmGrey-600">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        Gestor
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/profile');
                      }}
                      className="btn-ghost w-full text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Editar Perfil
                      </span>
                    </button>

                    <div className="border-t border-warmGrey-200 pt-3">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="btn-ghost w-full text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sair
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}