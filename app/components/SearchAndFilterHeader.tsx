'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

export interface FilterState {
  departamento: string;
  gestor: string;
  tipo: string;
  status: string;
}

interface SearchResult {
  id: string;
  nome: string;
  nivelHierarquia: string;
  setor: string;
  status: string;
  tipo: string;
}

interface SearchAndFilterHeaderProps {
  onSearch?: (results: SearchResult[]) => void;
  onFilterChange?: (filters: FilterState) => void;
}

export default function SearchAndFilterHeader({
  onSearch,
  onFilterChange,
}: SearchAndFilterHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    departamento: '',
    gestor: '',
    tipo: '',
    status: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setError(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError('Digite um nome ou ID para buscar');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?nome=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();

      if (onSearch) {
        onSearch(data);
      }

      if (data.length === 0) {
        setError('Nenhum resultado encontrado');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    const resetFilters = {
      departamento: '',
      gestor: '',
      tipo: '',
      status: '',
    };
    setFilters(resetFilters);
    setError(null);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  return (
    <div className={`sticky ${isScrolled ? 'top-16' : 'top-40'} z-30 shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-800`}>
      <header className="w-full">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isScrolled ? 'py-2' : 'py-4'}`}>
        {!isScrolled && <h1 className="text-white text-2xl font-bold mb-4">Buscar Usuário</h1>}

        {/* Busca e Filtros na mesma linha */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 transition-all duration-300">
          {/* Seção de Busca */}
          <div className="mb-4 pb-4 border-b border-white border-opacity-20">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-black mb-2">
                  Search
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Name, title, or email..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm whitespace-nowrap"
                  >
                    {isLoading ? '...' : 'Search'}
                  </button>
                </div>
              </div>
            </form>

            {/* Mensagem de erro */}
            {error && (
              <div className="text-white bg-red-500 bg-opacity-20 border border-red-400 rounded-lg px-4 py-2 mt-3 max-w-md text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Seção de Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">

            {/* Departamento */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-black mb-2">
                Department
              </label>
              <select
                value={filters.departamento}
                onChange={(e) => handleFilterChange('departamento', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              >
                <option value="">All Departments</option>
                <option value="TI">TI</option>
                <option value="Vendas">Vendas</option>
                <option value="Financeiro">Financeiro</option>
                <option value="RH">RH</option>
              </select>
            </div>

            {/* Gestor */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-black mb-2">
                Manager
              </label>
              <select
                value={filters.gestor}
                onChange={(e) => handleFilterChange('gestor', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              >
                <option value="">All Managers</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
                <option value="Ana Costa">Ana Costa</option>
              </select>
            </div>

            {/* Tipo */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-black mb-2">
                Type
              </label>
              <select
                value={filters.tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              >
                <option value="">All Types</option>
                <option value="employee">Funcionário</option>
                <option value="partner">Parceiro</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-black mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            {/* Botão Limpar */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      </header>
    </div>
  );
}
