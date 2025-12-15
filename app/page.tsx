'use client';

import { useState } from 'react';
import Statistics from './components/Statistics';
import TabsNavigation, { TabType } from './components/TabsNavigation';
import PeopleSearch, { FilteredStats } from './components/PeopleSearch';
import BubbleOrganizationChart from './components/BubbleOrganizationChart';
import ListagemTable from './components/ListagemTable';
import SearchResults from './components/SearchResults';

interface Person {
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
          <h2 className="text-2xl font-semibold text-black mb-6">
            Organograma
          </h2>
          <BubbleOrganizationChart />
        </div>
      )}
    </main>
  );
}
