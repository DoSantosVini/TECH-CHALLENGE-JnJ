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
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [managers, setManagers] = useState<string[]>([]);

  useEffect(() => {
    // Buscar departamentos e gestores únicos do banco
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/people');
        if (!response.ok) return;
        const data = await response.json();
        
        // Extrair departamentos únicos
        const uniqueDepts = Array.from(new Set(data.map((p: any) => p.department).filter(Boolean)));
        setDepartments(uniqueDepts as string[]);
        
        // Extrair nomes de pessoas que são gestores (baseado em jobTitle)
        const managersList = data
          .filter((p: any) => {
            const title = (p.jobTitle || '').toLowerCase();
            return title.includes('manager') || title.includes('director') || 
                   title.includes('vice president') || title.includes('president') ||
                   title.includes('ceo') || title.includes('vp');
          })
          .map((p: any) => p.name);
        setManagers(managersList);
      } catch (err) {
        console.error('Erro ao carregar opções de filtro:', err);
      }
    };
    
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setError(null);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange?.(updated);
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
      const res = await fetch(
        `/api/search?nome=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) throw new Error('Erro ao buscar dados');

      const data = await res.json();
      onSearch?.(data);

      if (data.length === 0) {
        setError('Nenhum resultado encontrado');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const reset = {
      departamento: '',
      gestor: '',
      tipo: '',
      status: '',
    };
    setSearchTerm('');
    setFilters(reset);
    setError(null);
    onFilterChange?.(reset);
  };

  return (
    <div
      className={`
        sticky z-30 transition-all duration-300
        ${isScrolled ? 'top-16 shadow-md' : 'top-40'}
        bg-[var(--jj-red)]
      `}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isScrolled ? 'py-3' : 'py-5'}`}>
        {!isScrolled && (
          <div className="mb-4">
            <h1 className="text-white text-2xl font-semibold">
              Buscar pessoas
            </h1>
            <p className="text-white/80 text-sm">
              Refine sua busca usando filtros organizacionais
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 items-end"
          >
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Busca
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Nome ou ID"
                disabled={isLoading}
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-300
                  text-black placeholder-gray-400 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
                "
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                value={filters.departamento}
                onChange={(e) =>
                  handleFilterChange('departamento', e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Todos</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Manager */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Gestor
              </label>
              <select
                value={filters.gestor}
                onChange={(e) =>
                  handleFilterChange('gestor', e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Todos</option>
                {managers.map((manager) => (
                  <option key={manager} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.tipo}
                onChange={(e) =>
                  handleFilterChange('tipo', e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Todos</option>
                <option value="Employee">Funcionário</option>
                <option value="Partner">Parceiro</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange('status', e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Todos</option>
                <option value="Active">Ativo</option>
                <option value="Inactive">Inativo</option>
              </select>
            </div>

            {/* Clear */}
            <div>
              <button
                type="button"
                onClick={handleReset}
                className="
                  w-full px-4 py-2 rounded-lg text-sm font-medium
                  bg-gray-100 text-black
                  hover:bg-gray-200 transition-colors
                "
              >
                Limpar
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-3 text-sm text-black border border-gray-300 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
