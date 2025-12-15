'use client';

import { useState } from 'react';
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

  const [activeTab, setActiveTab] = useState<'lista' | 'tabela'>('lista');

  const handleSearch = (results: SearchResult[]) => {
    setResults(results);
    setHasSearched(true);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="relative">
        <Statistics />

        <SearchAndFilterHeader
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        <TabsNavigation
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t)}
        />
      </div>

      <div className="relative z-10">
        {hasSearched && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {results.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Resultados da Busca ({results.length})
                </h2>

                <div className="grid gap-6">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-black">
                            {result.nome}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ID: {result.id}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            result.status === 'ativo'
                              ? 'bg-gray-50 text-black border-gray-300'
                              : 'bg-gray-200 text-black border-gray-300'
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Cargo</p>
                          <p className="font-medium text-black">
                            {result.nivelHierarquia}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600">Setor</p>
                          <p className="font-medium text-black">
                            {result.setor}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600">Tipo</p>
                          <p className="font-medium text-black">
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
                <p className="text-gray-600 text-base">
                  Nenhum resultado encontrado para sua busca
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === 'tabela' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-black mb-6">
            Organograma
          </h2>
          <BubbleOrganizationChart />
        </div>
      )}
    </main>
  );
}
