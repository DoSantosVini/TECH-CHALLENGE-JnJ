"use client";

import React from "react";

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

const peopleData: Person[] = [
  {
    id: 1,
    name: "Joaquin Duato",
    jobTitle: "CEO",
    department: "Executive",
    type: "Employee",
    status: "Active",
    location: "United States",
    workEmail: "joaquin.duato@jnj.com",
    hireDate: "2017-04-28",
    photoUrl: "https://via.placeholder.com/200",
  },
  {
    id: 2,
    name: "Maria Souza",
    jobTitle: "Vice President",
    department: "Executive",
    type: "Employee",
    status: "Active",
    location: "United States",
    workEmail: "maria.souza@jnj.com",
    hireDate: "2003-08-16",
  },
];

export default function ListagemTable() {
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
