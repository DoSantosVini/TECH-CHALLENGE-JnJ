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

export default function Statistics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);	const [isScrolled, setIsScrolled] = useState(false);

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
        <div className="bg-white rounded-lg shadow p-6">
          Carregando estatísticas...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 text-red-600">
          {error ?? 'Erro desconhecido'}
        </div>
      </div>
    );
  }

  return (
    <div className={`sticky top-0 z-40 bg-gray-50 transition-all duration-300 ${isScrolled ? 'shadow-lg py-3' : 'shadow-sm py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-lg shadow transition-all duration-300 ${isScrolled ? 'p-3' : 'p-6'}`}>
          {!isScrolled && (
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estatísticas</h2>
          )}

          <div className={`grid transition-all duration-300 ${isScrolled ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4'}`}>
            <div className={`bg-blue-50 rounded-lg ${isScrolled ? 'p-2' : 'p-4'}`}>
              <p className={`text-blue-600 ${isScrolled ? 'text-xs' : 'text-sm'}`}>Total de Pessoas</p>
              <p className={`font-bold text-blue-800 ${isScrolled ? 'text-lg' : 'text-3xl'}`}>
                {stats.total}
              </p>
            </div>

            <div className={`bg-green-50 rounded-lg ${isScrolled ? 'p-2' : 'p-4'}`}>
              <p className={`text-green-600 ${isScrolled ? 'text-xs' : 'text-sm'}`}>Ativos</p>
              <p className={`font-bold text-green-800 ${isScrolled ? 'text-lg' : 'text-3xl'}`}>
                {stats.ativos}
              </p>
            </div>

            <div className={`bg-gray-50 rounded-lg ${isScrolled ? 'p-2' : 'p-4'}`}>
              <p className={`text-gray-600 ${isScrolled ? 'text-xs' : 'text-sm'}`}>Inativos</p>
              <p className={`font-bold text-gray-900 ${isScrolled ? 'text-lg' : 'text-3xl'}`}>
                {stats.inativos}
              </p>
            </div>

            <div className={`bg-purple-50 rounded-lg ${isScrolled ? 'p-2' : 'p-4'}`}>
              <p className={`text-purple-600 ${isScrolled ? 'text-xs' : 'text-sm'}`}>Gerências</p>
              <p className={`font-bold text-purple-800 ${isScrolled ? 'text-lg' : 'text-3xl'}`}>
                {stats.gerencias}
              </p>
            </div>

            <div className={`bg-white rounded-lg border ${isScrolled ? 'p-2' : 'p-4'}`}>
              <p className={`text-gray-600 ${isScrolled ? 'text-xs' : 'text-sm'}`}>Employe</p>
              <p className={`font-bold text-gray-900 ${isScrolled ? 'text-base' : 'text-2xl'}`}>
                {stats.employees}
              </p>
            </div>

            <div className={`bg-white rounded-lg border ${isScrolled ? 'p-2' : 'p-4'}`}>
              <p className={`text-gray-600 ${isScrolled ? 'text-xs' : 'text-sm'}`}>Partner</p>
              <p className={`font-bold text-gray-900 ${isScrolled ? 'text-base' : 'text-2xl'}`}>
                {stats.partners}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}