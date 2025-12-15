'use client';

import { useEffect, useState } from 'react';
import { Person } from './PeoplePage';

export default function ListagemTable() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [managerMap, setManagerMap] = useState<Record<number, string>>({});

  // Buscar todos os dados ao montar o componente
  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/people');
        if (!response.ok) throw new Error('Erro ao buscar dados');
        const fetchedData = await response.json();
        setPeople(fetchedData);
        
        // Criar mapeamento de managerId para nome
        const managers: Record<number, string> = {};
        fetchedData.forEach((person: any) => {
          if (person.id) {
            managers[person.id] = person.name;
          }
        });
        setManagerMap(managers);
      } catch (err) {
        console.error('Erro ao carregar pessoas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {people.map((p, index) => (
              <tr key={`${p.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-black">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.jobTitle}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.department}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {(p as any).managerId ? managerMap[(p as any).managerId] || '-' : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {(p as any).type === 'Employee' ? 'Funcionário' : (p as any).type === 'Partner' ? 'Parceiro' : '-'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`
                      inline-flex items-center px-2.5 py-1 rounded-full
                      text-xs font-medium border
                      ${
                        p.status === "Active"
                          ? "bg-gray-50 text-black border-gray-300"
                          : "bg-gray-200 text-black border-gray-300"
                      }
                    `}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
