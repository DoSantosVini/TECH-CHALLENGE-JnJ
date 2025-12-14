'use client';

import { useState, useEffect } from 'react';
import Statistics from './components/Statistics';
import TabsNavigation from './components/TabsNavigation';
import SearchAndFilterHeader, { FilterState } from './components/SearchAndFilterHeader';
import BubbleOrganizationChart from './components/BubbleOrganizationChart';

interface SearchResult {
  id: string;
  nome: string;
  nivelHierarquia: string;
  setor: string;
  status: string;
  tipo: string;
}

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    departamento: '',
    gestor: '',
    tipo: '',
    status: '',
  });

  const handleSearch = (results: SearchResult[]) => {
    setResults(results);
    setHasSearched(true);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const [activeTab, setActiveTab] = useState<'lista' | 'tabela'>('lista');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="relative">
        <Statistics />
        <SearchAndFilterHeader 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange} 
        />
        <TabsNavigation activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />
      </div>
      
      <div className="relative z-10">
      {hasSearched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {results.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resultados da Busca ({results.length})
              </h2>
              <div className="grid gap-6">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {result.nome}
                        </h3>
                        <p className="text-gray-600">ID: {result.id}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Cargo</p>
                        <p className="font-medium text-gray-900">
                          {result.nivelHierarquia}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Setor</p>
                        <p className="font-medium text-gray-900">
                          {result.setor}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-medium text-gray-900">
                          {result.tipo === 'employee'
                            ? 'Funcionário'
                            : 'Parceiro'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhum resultado encontrado para sua busca
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mensagem de orientação removida conforme solicitado */}
      </div>

      {/* Exemplo de Organograma (bubble chart) - exibido somente quando a aba Organograma estiver ativa */}
      {activeTab === 'tabela' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Organograma (exemplo)</h2>
          <BubbleOrganizationChart />
        </div>
      )}

    </main>
  );
}
