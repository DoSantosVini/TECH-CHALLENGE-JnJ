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

  return (
    <header className="w-full bg-[var(--jj-red)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-white text-3xl font-semibold">
              People Directory
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Busque pessoas por nome ou identificador
            </p>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Digite um nome ou ID…"
                disabled={isLoading}
                className="
                  flex-1 px-4 py-2.5 rounded-lg border border-gray-300
                  bg-white text-black placeholder-gray-400
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
                  disabled:bg-gray-100
                "
              />

              <button
                type="submit"
                disabled={isLoading}
                className="
                  px-6 py-2.5 rounded-lg font-medium text-sm
                  bg-white text-[var(--jj-red)]
                  border border-white
                  hover:bg-gray-100
                  disabled:bg-gray-200 disabled:text-gray-500
                  disabled:cursor-not-allowed
                  transition-colors
                "
              >
                {isLoading ? 'Buscando…' : 'Buscar'}
              </button>
            </div>
          </form>

          {error && (
            <div
              className="
                max-w-lg rounded-lg border border-white/40
                bg-white/95 text-black text-sm
                px-4 py-2
              "
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
