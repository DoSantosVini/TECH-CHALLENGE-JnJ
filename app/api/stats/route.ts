import { NextResponse } from 'next/server';

// Dados mock (pode ser substituído por uma origem real)
const dados = [
  {
    id: 'EMP001',
    nome: 'João Silva',
    nivelHierarquia: 'Diretor',
    setor: 'TI',
    status: 'ativo',
    tipo: 'employee',
  },
  {
    id: 'EMP002',
    nome: 'Maria Santos',
    nivelHierarquia: 'Gerente',
    setor: 'Vendas',
    status: 'ativo',
    tipo: 'employee',
  },
  {
    id: 'PART001',
    nome: 'Carlos Oliveira',
    nivelHierarquia: 'Consultor',
    setor: 'TI',
    status: 'inativo',
    tipo: 'partner',
  },
  {
    id: 'EMP003',
    nome: 'Ana Costa',
    nivelHierarquia: 'Analista',
    setor: 'Financeiro',
    status: 'ativo',
    tipo: 'employee',
  },
  {
    id: 'PART002',
    nome: 'Pedro Mendes',
    nivelHierarquia: 'Contratado',
    setor: 'RH',
    status: 'ativo',
    tipo: 'partner',
  },
];

export async function GET() {
  const total = dados.length;
  const ativos = dados.filter((d) => d.status === 'ativo').length;
  const inativos = dados.filter((d) => d.status === 'inativo').length;
  const employees = dados.filter((d) => d.tipo === 'employee').length;
  const partners = dados.filter((d) => d.tipo === 'partner').length;
  const gerencias = dados.filter((d) => {
    const nivel = (d.nivelHierarquia || '').toLowerCase();
    return nivel.includes('ger') || nivel.includes('diretor');
  }).length;

  return NextResponse.json({ total, ativos, inativos, gerencias, employees, partners });
}
