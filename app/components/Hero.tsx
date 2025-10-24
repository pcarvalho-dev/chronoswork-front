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
            Chronos.work é uma solução moderna de controle de tempo que ajuda você a monitorar suas horas de trabalho
            com funcionalidade simples de entrada e saída.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Começar Agora
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="btn-secondary text-lg px-8 py-4">
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
