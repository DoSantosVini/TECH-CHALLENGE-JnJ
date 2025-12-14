"use client";

import React from 'react';

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
}

const peopleData: Person[] = [
  { id: 1, name: "Joaquin Duato", jobTitle: "CEO", department: "Executive", type: "Employee", status: "Active", location: "United States", workEmail: "joaquin.duato@jnj.com", hireDate: "2017-04-28" },
  { id: 2, name: "Maria Souza", jobTitle: "Vice President", department: "Executive", type: "Employee", status: "Active", location: "United States", workEmail: "maria.souza@jnj.com", hireDate: "2003-08-16" },
  { id: 3, name: "João Costa", jobTitle: "Vice President", department: "Executive", type: "Employee", status: "Active", location: "United States", workEmail: "joao.costa@jnj.com", hireDate: "2022-10-21" },
  { id: 4, name: "Ana Oliveira", jobTitle: "Vice President", department: "Executive", type: "Employee", status: "Active", location: "United States", workEmail: "ana.oliveira@jnj.com", hireDate: "2008-03-15" },
  { id: 5, name: "Bruno Almeida", jobTitle: "Vice President", department: "Executive", type: "Employee", status: "Active", location: "United States", workEmail: "bruno.almeida@jnj.com", hireDate: "2008-06-09" },
  { id: 6, name: "Carla Pereira", jobTitle: "Director", department: "IT", type: "Employee", status: "Active", location: "Brazil", workEmail: "carla.pereira@jnj.com", hireDate: "2007-03-30" },
  { id: 7, name: "Diego Santos", jobTitle: "Director", department: "Marketing", type: "Employee", status: "Active", location: "Japan", workEmail: "diego.santos@jnj.com", hireDate: "1999-05-05" },
  { id: 8, name: "Fernanda Ferreira", jobTitle: "Director", department: "Support", type: "Employee", status: "Active", location: "Canada", workEmail: "fernanda.ferreira@jnj.com", hireDate: "2021-09-19" },
  { id: 9, name: "Gustavo Lima", jobTitle: "Director", department: "Sales", type: "Employee", status: "Inactive", location: "Argentina", workEmail: "gustavo.lima@jnj.com", hireDate: "2020-11-24" },
  { id: 10, name: "Helena Gomes", jobTitle: "Director", department: "Executive", type: "Employee", status: "Active", location: "United States", workEmail: "helena.gomes@jnj.com", hireDate: "2001-01-20" },
  { id: 11, name: "Igor Silva", jobTitle: "Director", department: "Engineering", type: "Employee", status: "Active", location: "Singapore", workEmail: "igor.silva@jnj.com", hireDate: "2013-01-18" },
  { id: 12, name: "Juliana Souza", jobTitle: "Director", department: "Product", type: "Employee", status: "Active", location: "Brazil", workEmail: "juliana.souza@jnj.com", hireDate: "1994-03-29" },
  { id: 13, name: "Lucas Costa", jobTitle: "Director", department: "Finance", type: "Employee", status: "Active", location: "Canada", workEmail: "lucas.costa@jnj.com", hireDate: "2016-05-05" },
  { id: 14, name: "Mariana Oliveira", jobTitle: "Senior Manager", department: "HR", type: "Employee", status: "Active", location: "India", workEmail: "mariana.oliveira@jnj.com", hireDate: "2013-03-27" },
  { id: 15, name: "Nicolas Almeida", jobTitle: "Senior Manager", department: "Operations", type: "Employee", status: "Active", location: "Spain", workEmail: "nicolas.almeida@jnj.com", hireDate: "1995-07-10" },
  { id: 56, name: "Olivia Pereira", jobTitle: "Software Engineer", department: "IT", type: "Partner", status: "Active", location: "Singapore", workEmail: "olivia.p@jnj.com", hireDate: "2004-10-29" },
  { id: 57, name: "Paulo Santos", jobTitle: "QA Engineer", department: "Marketing", type: "Employee", status: "Active", location: "Canada", workEmail: "paulo.s@jnj.com", hireDate: "1993-09-22" },
  { id: 58, name: "Renata Ferreira", jobTitle: "Business Analyst", department: "Support", type: "Employee", status: "Active", location: "Brazil", workEmail: "renata.f@jnj.com", hireDate: "2021-02-04" },
  { id: 59, name: "Sofia Lima", jobTitle: "Product Specialist", department: "Sales", type: "Partner", status: "Active", location: "Germany", workEmail: "sofia.l@jnj.com", hireDate: "1996-10-31" },
  { id: 60, name: "Thiago Gomes", jobTitle: "Data Analyst", department: "Executive", type: "Employee", status: "Active", location: "United States", workEmail: "thiago.g@jnj.com", hireDate: "2012-02-16" },
  { id: 62, name: "Maria Souza", jobTitle: "Software Engineer", department: "Product", type: "Partner", status: "Active", location: "Spain", workEmail: "maria.souza1@jnj.com", hireDate: "2001-08-28" },
  { id: 63, name: "João Costa", jobTitle: "QA Engineer", department: "Finance", type: "Employee", status: "Inactive", location: "Canada", workEmail: "joao.costa1@jnj.com", hireDate: "2021-01-21" },
  { id: 65, name: "Bruno Almeida", jobTitle: "Product Specialist", department: "Operations", type: "Partner", status: "Active", location: "Japan", workEmail: "bruno.almeida1@jnj.com", hireDate: "2006-05-10" },
  { id: 68, name: "Fernanda Ferreira", jobTitle: "Software Engineer", department: "Support", type: "Partner", status: "Active", location: "Argentina", workEmail: "fernanda.ferreira1@jnj.com", hireDate: "1995-10-23" },
  { id: 72, name: "Juliana Souza", jobTitle: "Data Analyst", department: "Product", type: "Employee", status: "Inactive", location: "Brazil", workEmail: "juliana.souza1@jnj.com", hireDate: "2002-10-12" },
];

export default function ListagemTable() {

  const openPersonWindow = (person: Person) => {
    if (typeof window === 'undefined') return;

    const width = 700;
    const height = 520;
    const left = (window.screenX ?? window.screenLeft ?? 0) + (window.innerWidth - width) / 2;
    const top = (window.screenY ?? window.screenTop ?? 0) + (window.innerHeight - height) / 2;

    const features = `width=${width},height=${height},left=${Math.max(0, Math.round(left))},top=${Math.max(0, Math.round(top))},resizable,scrollbars`;
    const win = window.open('', `_person_${person.id}`, features);
    if (!win) return;

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Detalhes - ${person.name}</title>
          <style>
            body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:0; background:#f8fafc; color:#0f172a; }
            .container { max-width:640px; margin:20px auto; padding:18px; }
            .card { background:#fff; padding:14px; border-radius:10px; box-shadow:0 6px 18px rgba(2,6,23,0.06); }
            h1{ margin:0 0 8px 0; font-size:18px; }
            ul{ margin:12px 0 0 18px; padding:0; }
            li{ margin:8px 0; color:#374151; }
            .muted{ color:#6b7280; font-size:13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Detalhes da pessoa</h1>
            <p class="muted">Informações gerais</p>
            <div style="display:flex;gap:16px;align-items:flex-start">
              <div style="width:120px;height:120px;border-radius:8px;background:#e6eef8;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:600">Foto</div>
              <div class="card" style="flex:1">
                <ul>
                  <li><strong>Name:</strong> ${person.name}</li>
                  <li><strong>Job Title:</strong> ${person.jobTitle}</li>
                  <li><strong>Department:</strong> ${person.department}</li>
                  <li><strong>Type:</strong> ${person.type}</li>
                  <li><strong>Status:</strong> ${person.status}</li>
                  <li><strong>Location:</strong> ${person.location}</li>
                  <li><strong>Work Email:</strong> ${person.workEmail ?? '—'}</li>
                  <li><strong>Hire Date:</strong> ${person.hireDate ?? '—'}</li>
                </ul>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
    try { win.focus(); } catch (e) { /* ignore */ }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Cabeçalho da Tabela */}
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider w-12"> </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>

            {/* Corpo da Tabela */}
            <tbody className="divide-y divide-gray-200">
              {peopleData.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPersonWindow(person);
                      }}
                      aria-label={`Abrir janela de detalhes de ${person.name}`}
                      title="Abrir detalhes"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                    >
                      <img
                        src="/badge-icon.svg"
                        alt={`Detalhes de ${person.name}`}
                        className="w-5 h-5 object-contain"
                        draggable={false}
                      />
                    </button>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {person.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {person.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {person.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          person.type === 'Employee'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {person.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          person.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {person.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {person.location}
                    </td>
                  </tr>

              ))}
            </tbody>
          </table>
        </div>

        {/* Footer com contagem */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando <strong>{peopleData.length}</strong> de <strong>{peopleData.length}</strong> registros
          </p>
        </div>
      </div>
    </div>
  );
}
