'use client';

import { useState } from 'react';
import PeopleSearch, { Person } from './PeopleSearch';
import ListagemTable from './ListagemTable';
import BubbleOrganizationChart from './BubbleOrganizationChart';

export type { Person };

type ViewMode = 'list' | 'chart';

export default function PeoplePage() {
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleSearchResults = (results: Person[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleReset = async () => {
    setHasSearched(false);
    setSearchResults([]);
    
    // Recarregar todos os dados
    try {
      const response = await fetch('/api/people');
      if (response.ok) {
        const data = await response.json();
        setAllPeople(data);
      }
    } catch (err) {
      console.error('Erro ao recarregar dados:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Componente de Busca */}
      <PeopleSearch
        onResults={handleSearchResults}
        onLoading={handleLoading}
        onReset={handleReset}
      />

      {/* Tabs de Visualização */}
      <div className="sticky top-[180px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 justify-center sm:justify-start">
            <button
              onClick={() => setViewMode('list')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-medium
                transition-all
                ${
                  viewMode === 'list'
                    ? 'bg-[var(--jj-red)] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span className="text-lg">👥</span>
              <span>Listagem</span>
            </button>

            <button
              onClick={() => setViewMode('chart')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-medium
                transition-all
                ${
                  viewMode === 'chart'
                    ? 'bg-[var(--jj-red)] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span className="text-lg">📊</span>
              <span>Organograma</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="py-6">
        {viewMode === 'list' ? (
          <ListagemTable
            searchResults={searchResults}
            hasSearched={hasSearched}
            allPeople={allPeople}
            loading={isLoading}
          />
        ) : (
          <BubbleOrganizationChart />
        )}
      </div>
    </div>
  );
}
