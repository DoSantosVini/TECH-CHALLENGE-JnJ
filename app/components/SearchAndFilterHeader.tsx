'use client';

import { ChangeEvent, useEffect, useState } from 'react';

export interface FilterState {
  departamento: string;
  gestor: string;
  tipo: string;
  status: string;
}

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function SearchAndFilterHeader({
  searchTerm,
  onSearchChange,
  filters: externalFilters,
  onFilterChange,
  onReset,
}: Props) {
  const [filters, setFilters] = useState<FilterState>({
    departamento: '',
    gestor: '',
    tipo: '',
    status: '',
  });

  // Sincronizar com filtros externos
  useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
    }
  }, [externalFilters]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    setFilters({
      departamento: '',
      gestor: '',
      tipo: '',
      status: '',
    });
    onReset();
  };

  return (
    <div className="sticky top-[200px] z-20 bg-[var(--jj-red)] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-3">
          <h1 className="text-white text-2xl font-semibold">
            Buscar pessoas
          </h1>
          <p className="text-white/80 text-sm">
            Refine sua busca usando filtros organizacionais
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 items-end">
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
                onChange={(e) => handleFilterChange('departamento', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Todos</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
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
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Todos</option>
                <option value="Active">Ativo</option>
                <option value="Inactive">Inativo</option>
              </select>
            </div>

            {/* Clear Button */}
            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={handleReset}
                className="
                  w-full px-4 py-2 rounded-lg text-sm font-medium
                  border border-gray-300
                  bg-gray-300 text-black
                  hover:bg-gray-400 transition-colors
                "
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
