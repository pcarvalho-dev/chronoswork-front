'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-warmGrey-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-navbar">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Chronos.work"
              width={240}
              height={64}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-warmGrey-700 hover:text-primary-600 transition-colors">
              Recursos
            </a>
            <a href="#about" className="text-warmGrey-700 hover:text-primary-600 transition-colors">
              Sobre
            </a>
            <a href="#contact" className="text-warmGrey-700 hover:text-primary-600 transition-colors">
              Contato
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="btn-ghost">
              Entrar
            </Link>
            <Link href="/register" className="btn-primary">
              Começar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-warmGrey-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-warmGrey-200">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-warmGrey-700 hover:text-primary-600 transition-colors">
                Recursos
              </a>
              <a href="#about" className="text-warmGrey-700 hover:text-primary-600 transition-colors">
                Sobre
              </a>
              <a href="#contact" className="text-warmGrey-700 hover:text-primary-600 transition-colors">
                Contato
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-warmGrey-200">
                <Link href="/login" className="btn-ghost w-full">
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary w-full">
                  Começar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
