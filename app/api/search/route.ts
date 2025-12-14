import { NextRequest, NextResponse } from 'next/server';

// Dados simulados - você pode substituir por uma chamada real ao banco de dados
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nome = searchParams.get('nome');

  if (!nome || nome.trim() === '') {
    return NextResponse.json(
      { error: 'Nome é obrigatório' },
      { status: 400 }
    );
  }

  // Filtro case-insensitive
  const resultados = dados.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(nome.toLowerCase())
  );

  return NextResponse.json({
    total: resultados.length,
    resultados,
  });
}
