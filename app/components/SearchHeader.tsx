'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface SearchResult {
  id: string;
  nome: string;
  nivelHierarquia: string;
  setor: string;
  status: string;
  tipo: string;
}

interface SearchHeaderProps {
  onSearch?: (results: SearchResult[]) => void;
}

export default function SearchHeader({ onSearch }: SearchHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setError(null);
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

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-white text-3xl font-bold">Buscar Usuário</h1>
          
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Digite um nome ou ID..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {error && (
            <div className="text-white bg-red-500 bg-opacity-20 border border-red-400 rounded-lg px-4 py-2 max-w-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
