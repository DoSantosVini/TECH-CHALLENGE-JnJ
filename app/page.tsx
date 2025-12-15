'use client';

import { useState, useEffect } from 'react';
import Statistics from './components/Statistics';
import TabsNavigation, { TabType } from './components/TabsNavigation';
import PeopleSearch, { FilteredStats, Person as SearchPerson } from './components/PeopleSearch';
import BubbleOrganizationChart from './components/BubbleOrganizationChart';
import ListagemTable from './components/ListagemTable';
import SearchResults from './components/SearchResults';

export interface Person {
  id: number;
  name: string;
  jobTitle: string;
  department: string;
  type: string;
  status: string;
  location: string;
  workEmail?: string;
  hireDate?: string;
  photoUrl?: string;
}

export default function Home() {
  const [results, setResults] = useState<Person[]>([]);
  const [allPeople, setAllPeople] = useState<Person[]>([]); // Lista completa para direct reports
  const [managerMap, setManagerMap] = useState<Record<number, string>>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('lista');
  const [filteredStats, setFilteredStats] = useState<FilteredStats | null>(null);

  // Opcional: carregar dados iniciais
  useEffect(() => {
    const fetchAllPeople = async () => {
      try {
        const response = await fetch('/api/people');
        if (response.ok) {
          const data: Person[] = await response.json();
          setAllPeople(data);
        }
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      }
    };
    fetchAllPeople();
  }, []);

  const handlePeopleSearchResults = (
    searchResults: Person[], 
    managers: Record<number, string>,
    stats: FilteredStats,
    allPeopleData: Person[]
  ) => {
    setResults(searchResults);
    setManagerMap(managers);
    setFilteredStats(stats);
    setAllPeople(allPeopleData);
    setHasSearched(true);
  };

  const handlePeopleSearchLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handlePeopleSearchReset = () => {
    setResults([]);
    setManagerMap({});
    setFilteredStats(null);
    setAllPeople([]);
    setHasSearched(false);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="relative">
        <Statistics filteredStats={filteredStats} />

        <TabsNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'lista' && (
          <PeopleSearch
            onResults={handlePeopleSearchResults}
            onLoading={handlePeopleSearchLoading}
            onReset={handlePeopleSearchReset}
          />
        )}
      </div>

      <div className="relative z-10">
        {activeTab === 'lista' && (
          <>
            {hasSearched ? (
              <SearchResults 
                results={results}
                managerMap={managerMap}
                loading={isLoading}
                allPeople={allPeople}
              />
            ) : (
              <ListagemTable />
            )}
          </>
        )}
      </div>

      {activeTab === 'organograma' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BubbleOrganizationChart />
        </div>
      )}
    </main>
  );
}
