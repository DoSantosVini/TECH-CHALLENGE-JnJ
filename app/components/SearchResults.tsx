'use client';

import { useState } from 'react';

interface Person {
  id: number;
  name: string;
  jobTitle: string;
  department: string;
  status: string;
  type: string;
}

interface Props {
  results: Person[];
  managerMap: Record<number, string>;
  loading?: boolean;
  allPeople?: Person[]; // Lista completa para buscar direct reports
}

export default function SearchResults({ results, managerMap, loading, allPeople }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (person: Person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  // Calcular direct reports para a pessoa selecionada
  const getDirectReports = (personId: number) => {
    // Buscar em todas as pessoas, não apenas nos resultados filtrados
    const peopleToSearch = allPeople || results;
    return peopleToSearch.filter(p => {
      const managerId = (p as any).managerId;
      if (!managerId) return false;
      // Garantir que ambos são números para comparação correta
      const managerIdNum = typeof managerId === 'string' ? parseInt(managerId) : managerId;
      return managerIdNum === personId;
    });
  };
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">Buscando...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">Nenhum resultado encontrado para os filtros aplicados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Resultados da Busca ({results.length} {results.length === 1 ? 'pessoa' : 'pessoas'})
        </h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                ID
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
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
            {results.map((p, index) => (
              <tr key={`${p.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.id}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--jj-red)] text-white text-xs font-medium rounded hover:bg-red-700 transition-colors mx-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    Ver Detalhes
                  </button>
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

      {/* Modal */}
      {isModalOpen && selectedPerson && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-sm bg-white/30" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                {(selectedPerson as any).photoPath && (
                  <img 
                    src={(selectedPerson as any).photoPath} 
                    alt={selectedPerson.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
                    }}
                  />
                )}
                <h2 className="text-2xl font-bold text-gray-900">{selectedPerson.name}</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600">ID</p>
                <p className="text-base text-gray-900">{selectedPerson.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Cargo</p>
                <p className="text-base text-gray-900">{selectedPerson.jobTitle}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Departamento</p>
                <p className="text-base text-gray-900">{selectedPerson.department}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Manager</p>
                <p className="text-base text-gray-900">
                  {(selectedPerson as any).managerId ? managerMap[(selectedPerson as any).managerId] || '-' : '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Tipo</p>
                <p className="text-base text-gray-900">
                  {(selectedPerson as any).type === 'Employee' ? 'Funcionário' : (selectedPerson as any).type === 'Partner' ? 'Parceiro' : '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <p className="text-base text-gray-900">{selectedPerson.status}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Email</p>
                <p className="text-base text-gray-900">{(selectedPerson as any).workEmail || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Data de Contratação</p>
                <p className="text-base text-gray-900">{(selectedPerson as any).hireDate || '-'}</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm font-semibold text-gray-600">Localização</p>
                <p className="text-base text-gray-900">{(selectedPerson as any).location || '-'}</p>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Direct Reports</p>
              {getDirectReports(selectedPerson.id).length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {getDirectReports(selectedPerson.id).map((report, idx) => (
                    <li key={idx} className="text-base text-gray-900">
                      {report.name} - {report.jobTitle}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base text-gray-500 italic">Nenhum subordinado direto</p>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-[var(--jj-red)] text-white rounded hover:bg-red-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
