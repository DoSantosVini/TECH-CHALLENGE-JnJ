'use client';

import { ChangeEvent, useEffect, useState, useRef } from 'react';

export interface FilterState {
  departamento: string;
  manager: string;
  tipo: string;
  status: string;
}

export interface Person {
  id: number;
  name: string;
  jobTitle: string;
  department: string;
  status: string;
  employeeType: string;
}

interface Props {
  onResults: (results: Person[], managerMap: Record<number, string>) => void;
  onLoading?: (loading: boolean) => void;
  onReset?: () => void;
}

export default function PeopleSearch({
  onResults,
  onLoading,
  onReset,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    departamento: '',
    manager: '',
    tipo: '',
    status: '',
  });
  const [departments, setDepartments] = useState<string[]>([]);
  const [managers, setManagers] = useState<string[]>([]);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [managerMap, setManagerMap] = useState<Record<number, string>>({});

  // Buscar todos os dados uma vez ao montar o componente
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoadingData(true);
      onLoading?.(true);
      
      try {
        const response = await fetch('/api/people');
        if (!response.ok) throw new Error('Erro ao buscar dados');
        const data: Person[] = await response.json();
        
        setAllPeople(data);
        
        // Extrair departamentos únicos
        const uniqueDepts = Array.from(
          new Set(data.map((p) => p.department))
        ).sort();
        setDepartments(uniqueDepts);
        
        // Criar mapeamento de id para nome (para resolver managerId)
        const map: Record<number, string> = {};
        data.forEach((person: any) => {
          if (person.id) {
            map[person.id] = person.name;
          }
        });
        setManagerMap(map);

        // Extrair managers únicos - pessoas que aparecem como managerId de alguém
        const managerIds = new Set<number>();
        data.forEach((person: any) => {
          if (person.managerId) {
            managerIds.add(Number(person.managerId));
          }
        });
        
        // Criar lista de managers com ID e nome para evitar duplicatas
        const managersList: Array<{id: number, name: string, displayName: string}> = [];
        
        Array.from(managerIds).forEach(id => {
          const person = data.find((p: any) => Number(p.id) === id);
          if (person) {
            managersList.push({
              id: id,
              name: person.name,
              displayName: `${person.name} (ID: ${id})`
            });
          }
        });
        
        // Adicionar pessoas com cargo de gerente/diretor que ainda não estão na lista
        data.forEach((person: any) => {
          if (/gerente|diretor|manager|gestor|supervisor|coordenador/i.test(person.jobTitle)) {
            const alreadyExists = managersList.some(m => m.id === Number(person.id));
            if (!alreadyExists) {
              managersList.push({
                id: Number(person.id),
                name: person.name,
                displayName: `${person.name} (ID: ${person.id})`
              });
            }
          }
        });
        
        // Ordenar por nome e depois por ID
        managersList.sort((a, b) => {
          const nameCompare = a.name.localeCompare(b.name);
          return nameCompare !== 0 ? nameCompare : a.id - b.id;
        });
        
        // Armazenar a lista completa de managers com IDs
        const uniqueManagers = managersList.map(m => m.displayName);
        setManagers(uniqueManagers);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setIsLoadingData(false);
        onLoading?.(false);
      }
    };

    fetchAllData();
  }, []);

  // Filtrar dados localmente quando houver mudanças
  useEffect(() => {
    if (isLoadingData) return;

    // Se não houver termo de busca nem filtros, não aplicar filtro (mas não chamar onResults)
    if (
      !searchQuery.trim() &&
      !filters.departamento &&
      !filters.manager &&
      !filters.tipo &&
      !filters.status
    ) {
      return;
    }

    let filtered = [...allPeople];

    // Filtrar por termo de busca (nome ou ID)
    if (searchQuery.trim()) {
      const searchLower = searchQuery.trim().toLowerCase();
      const isNumeric = /^\d+$/.test(searchQuery.trim());
      
      filtered = filtered.filter((person: any) => {
        if (isNumeric) {
          // Busca por ID exato
          return person.id === parseInt(searchQuery.trim());
        } else {
          // Busca por nome (case-insensitive)
          return person.name.toLowerCase().includes(searchLower);
        }
      });
    }

    // Filtrar por departamento
    if (filters.departamento) {
      filtered = filtered.filter((person: any) => 
        person.department === filters.departamento
      );
    }

    // Filtrar por manager (subordinados do manager selecionado)
    if (filters.manager) {
      // Extrair o ID do formato "Nome (ID: 123)"
      const idMatch = filters.manager.match(/\(ID:\s*(\d+)\)/);
      
      if (idMatch) {
        const managerId = Number(idMatch[1]);
        
        filtered = filtered.filter((person: any) => {
          const personManagerId = Number(person.managerId);
          return personManagerId === managerId;
        });
      } else {
        // Fallback: buscar pelo nome (caso não tenha ID no formato esperado)
        const managerEntry = allPeople.find((p: any) => p.name === filters.manager);
        
        if (managerEntry) {
          const managerId = Number((managerEntry as any).id);
          
          filtered = filtered.filter((person: any) => {
            const personManagerId = Number(person.managerId);
            return personManagerId === managerId;
          });
        } else {
          filtered = [];
        }
      }
    }

    // Filtrar por tipo
    if (filters.tipo) {
      filtered = filtered.filter((person: any) => 
        person.employeeType === filters.tipo
      );
    }

    // Filtrar por status
    if (filters.status) {
      filtered = filtered.filter((person: any) => 
        person.status === filters.status
      );
    }

    onResults(filtered, managerMap);
  }, [searchQuery, filters, allPeople, isLoadingData, managerMap]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchQuery('');
    setFilters({
      departamento: '',
      manager: '',
      tipo: '',
      status: '',
    });
    onReset?.();
  };

  return (
    <div className="sticky top-[100px] z-30 bg-[var(--jj-red)] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-3 text-center">
          <h1 className="text-white text-2xl font-semibold">
            Buscar pessoas
          </h1>
          <p className="text-white/80 text-sm">
            Pesquise por nome, ID ou use os filtros para refinar sua busca
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end justify-items-center">
            {/* Search Input */}
            <div className="lg:col-span-3 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                Busca
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Nome ou ID..."
                  className="
                    w-full px-3 py-2 rounded-lg border border-gray-300
                    text-black placeholder-gray-400 text-sm
                    focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
                  "
                />
                {isLoadingData && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--jj-red)] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full">
              <button
                type="button"
                onClick={handleSearch}
                disabled={isLoadingData}
                style={{ 
                  backgroundColor: isLoadingData ? undefined : 'var(--jj-red)',
                  color: 'white'
                }}
                className="
                  w-full px-4 py-2 rounded-lg text-sm font-medium
                  hover:bg-red-700 transition-colors
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  mt-[21px]
                "
              >
                {isLoadingData ? 'Carregando...' : 'Pesquisar'}
              </button>
            </div>

            {/* Department Filter */}
            <div className="lg:col-span-2 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                Departamento
              </label>
              <select
                value={filters.departamento}
                onChange={(e) => handleFilterChange('departamento', e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-300
                  text-black text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
                "
              >
                <option value="">Todos</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Manager Filter */}
            <div className="lg:col-span-2 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                Manager
              </label>
              <select
                value={filters.manager}
                onChange={(e) => handleFilterChange('manager', e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-300
                  text-black text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
                "
              >
                <option value="">Todos</option>
                {managers.map((mgr) => (
                  <option key={mgr} value={mgr}>
                    {mgr}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                Tipo
              </label>
              <select
                value={filters.tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-300
                  text-black text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
                "
              >
                <option value="">Todos</option>
                <option value="Employee">Funcionário</option>
                <option value="Partner">Parceiro</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-300
                  text-black text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-[var(--jj-red)]
                "
              >
                <option value="">Todos</option>
                <option value="Active">Ativo</option>
                <option value="Inactive">Inativo</option>
              </select>
            </div>

            {/* Clear Button */}
            <div className="lg:col-span-2 w-full">
              <button
                type="button"
                onClick={handleReset}
                style={{ 
                  backgroundColor: 'var(--jj-red)',
                  color: 'white'
                }}
                className="
                  w-full px-2 py-1.5 rounded-lg text-sm font-medium
                  hover:bg-red-700 transition-colors
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
