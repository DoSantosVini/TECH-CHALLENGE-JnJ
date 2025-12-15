'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  ativos: number;
  inativos: number;
  gerencias: number;
  employees: number;
  partners: number;
}

interface StatisticsProps {
  filteredStats?: Stats | null;
}

export default function Statistics({ filteredStats }: StatisticsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Usar estatísticas filtradas se disponíveis, senão usar as originais
  const displayStats = filteredStats || stats;

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('Erro ao buscar estatísticas');

        const data = await res.json();
        if (mounted) setStats(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Não foi possível carregar estatísticas');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          Carregando estatísticas…
        </div>
      </div>
    );
  }

  if (error || !displayStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-[var(--jj-red)]">
          {error ?? 'Erro desconhecido'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        sticky top-0 z-40 bg-white transition-all duration-300
        ${isScrolled ? 'shadow-md py-3' : 'shadow-sm py-6'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            bg-white rounded-lg transition-all duration-300
            ${isScrolled ? 'p-3' : 'p-6'}
          `}
        >
          {!isScrolled && (
            <h2 className="text-xl font-semibold text-black mb-4">
              Estatísticas
            </h2>
          )}

          <div
            className={`
              grid transition-all duration-300
              ${
                isScrolled
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4'
              }
            `}
          >
            {/* Total */}
            <StatCard
              label="Total de Pessoas"
              value={displayStats.total}
              highlight
              isScrolled={isScrolled}
            />

            <StatCard
              label="Ativos"
              value={displayStats.ativos}
              isScrolled={isScrolled}
            />

            <StatCard
              label="Inativos"
              value={displayStats.inativos}
              isScrolled={isScrolled}
            />

            <StatCard
              label="Gerências"
              value={displayStats.gerencias}
              isScrolled={isScrolled}
            />

            <StatCard
              label="Employees"
              value={displayStats.employees}
              isScrolled={isScrolled}
            />

            <StatCard
              label="Partners"
              value={displayStats.partners}
              isScrolled={isScrolled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Card padronizado ===== */
function StatCard({
  label,
  value,
  highlight = false,
  isScrolled,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  isScrolled: boolean;
}) {
  return (
    <div
      className={`
        rounded-lg border
        ${highlight ? 'border-[var(--jj-red)] bg-[rgba(235,17,0,0.04)]' : 'border-gray-200 bg-white'}
        ${isScrolled ? 'p-2' : 'p-4'}
      `}
    >
      <p
        className={`
          font-medium
          ${highlight ? 'text-[var(--jj-red)]' : 'text-gray-600'}
          ${isScrolled ? 'text-xs' : 'text-sm'}
        `}
      >
        {label}
      </p>

      <p
        className={`
          font-bold
          ${highlight ? 'text-black' : 'text-gray-900'}
          ${isScrolled ? 'text-lg' : 'text-3xl'}
        `}
      >
        {value}
      </p>
    </div>
  );
}
