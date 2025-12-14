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
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      departamento: '',
      gestor: '',
      tipo: '',
      status: '',
    };
    setFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Departamento */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={filters.departamento}
              onChange={(e) => handleFilterChange('departamento', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="TI">TI</option>
              <option value="Vendas">Vendas</option>
              <option value="Financeiro">Financeiro</option>
              <option value="RH">RH</option>
            </select>
          </div>

          {/* Gestor */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-700 mb-1">
              Gestor
            </label>
            <select
              value={filters.gestor}
              onChange={(e) => handleFilterChange('gestor', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="João Silva">João Silva</option>
              <option value="Maria Santos">Maria Santos</option>
              <option value="Ana Costa">Ana Costa</option>
            </select>
          </div>

          {/* Tipo */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="employee">Funcionário</option>
              <option value="partner">Parceiro</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          {/* Botão Limpar */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium text-sm transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
