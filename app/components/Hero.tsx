import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-warmGrey-900 mb-6">
            Rastreie seu tempo,
            <span className="text-primary-600"> sem esforço</span>
          </h1>
          <p className="text-xl md:text-2xl text-warmGrey-600 mb-12 max-w-3xl mx-auto">
            Chronos.work é uma solução moderna de controle de tempo para empresas que permite gestores criarem suas empresas
            e convidarem funcionários para um sistema completo de gestão de horas trabalhadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/manager/register" className="btn-primary text-lg px-8 py-4">
              Sou Gestor
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </Link>
            <Link href="/employee/register" className="btn-secondary text-lg px-8 py-4">
              Sou Funcionário
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="btn-ghost text-lg px-8 py-4">
              Ver Documentação
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-warmGrey-600">Grátis e Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">&lt; 1 min</div>
              <div className="text-warmGrey-600">Tempo de Configuração</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-warmGrey-600">Sempre Disponível</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
