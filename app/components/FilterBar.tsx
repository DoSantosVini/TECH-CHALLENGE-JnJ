'use client';

import { useState } from 'react';

export interface FilterState {
  departamento: string;
  gestor: string;
  tipo: string;
  status: string;
}

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    departamento: '',
    gestor: '',
    tipo: '',
    status: '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      departamento: '',
      gestor: '',
      tipo: '',
      status: '',
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
          {/* Departamento */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Departamento
            </label>
            <select
              value={filters.departamento}
              onChange={(e) =>
                handleFilterChange('departamento', e.target.value)
              }
              className="
                px-3 py-2 rounded-md border border-gray-300
                text-sm text-black bg-white
                focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
              "
            >
              <option value="">Todos</option>
              <option value="TI">TI</option>
              <option value="Vendas">Vendas</option>
              <option value="Financeiro">Financeiro</option>
              <option value="RH">RH</option>
            </select>
          </div>

          {/* Gestor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Gestor
            </label>
            <select
              value={filters.gestor}
              onChange={(e) => handleFilterChange('gestor', e.target.value)}
              className="
                px-3 py-2 rounded-md border border-gray-300
                text-sm text-black bg-white
                focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
              "
            >
              <option value="">Todos</option>
              <option value="João Silva">João Silva</option>
              <option value="Maria Santos">Maria Santos</option>
              <option value="Ana Costa">Ana Costa</option>
            </select>
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Tipo
            </label>
            <select
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              className="
                px-3 py-2 rounded-md border border-gray-300
                text-sm text-black bg-white
                focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
              "
            >
              <option value="">Todos</option>
              <option value="employee">Funcionário</option>
              <option value="partner">Parceiro</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="
                px-3 py-2 rounded-md border border-gray-300
                text-sm text-black bg-white
                focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
              "
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          {/* Limpar */}
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="
                w-full px-4 py-2 rounded-md
                border border-gray-300
                text-sm font-medium text-gray-700
                hover:bg-gray-50
                hover:border-[var(--jj-red)]
                hover:text-[var(--jj-red)]
                transition-colors
              "
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
