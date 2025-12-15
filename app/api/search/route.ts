import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nome = searchParams.get('nome');

  if (!nome || nome.trim() === '') {
    return NextResponse.json(
      { error: 'Nome é obrigatório' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();

  // Buscar no banco de dados com filtro case-insensitive
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .ilike('name', `%${nome}%`);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Mapear para o formato esperado pelo frontend
  const resultados = data.map((pessoa) => ({
    id: pessoa.id,
    nome: pessoa.name,
    nivelHierarquia: pessoa.jobTitle,
    setor: pessoa.department,
    status: pessoa.status.toLowerCase(),
    tipo: pessoa.type.toLowerCase(),
  }));

  return NextResponse.json({
    total: resultados.length,
    resultados,
  });
}
