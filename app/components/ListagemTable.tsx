"use client";

import React, { useEffect, useState } from "react";

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

export default function ListagemTable() {
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('/api/people');
        if (!response.ok) throw new Error('Erro ao buscar dados');
        const data = await response.json();
        setPeopleData(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados');
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const openPersonWindow = (person: Person) => {
    if (typeof window === "undefined") return;

    const win = window.open(
      "",
      `_person_${person.id}`,
      "width=720,height=600,resizable,scrollbars"
    );
    if (!win) return;

    win.document.open();
    win.document.write(`<h1>${person.name}</h1>`);
    win.document.close();
    win.focus();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          Carregando dados...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-red-600">
          {error}
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
              <th className="w-12 px-4 py-3" />
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
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {peopleData.map((person) => (
              <tr
                key={person.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Detalhes */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => openPersonWindow(person)}
                    className="
                      w-8 h-8 flex items-center justify-center
                      rounded-full border border-gray-300
                      text-sm text-gray-700
                      hover:bg-[var(--jj-red)] hover:text-white hover:border-[var(--jj-red)]
                      transition-colors
                    "
                    title="Ver detalhes"
                  >
                    ℹ
                  </button>
                </td>

                {/* Nome */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                      {getInitials(person.name)}
                    </div>
                    <span className="text-sm font-medium text-black">
                      {person.name}
                    </span>
                  </div>
                </td>

                {/* Cargo */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {person.jobTitle}
                </td>

                {/* Departamento */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {person.department}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`
                      inline-flex items-center px-2.5 py-1 rounded-full
                      text-xs font-medium border
                      ${
                        person.status === "Active"
                          ? "bg-gray-50 text-black border-gray-300"
                          : "bg-gray-200 text-black border-gray-300"
                      }
                    `}
                  >
                    {person.status}
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
