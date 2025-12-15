import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parâmetros de busca
  const search = searchParams.get('search') || searchParams.get('nome');
  const department = searchParams.get('department');
  const manager = searchParams.get('manager');
  const type = searchParams.get('type');
  const status = searchParams.get('status');

  const supabase = getSupabaseClient();

  // Construir query base
  let query = supabase.from('people').select('*');

  // Aplicar filtros condicionalmente
  if (search && search.trim() !== '') {
    // Buscar por nome ou ID
    const isNumeric = /^\d+$/.test(search.trim());
    
    if (isNumeric) {
      // Se for número, buscar por ID exato
      query = query.eq('id', parseInt(search.trim()));
    } else {
      // Se for texto, buscar por nome (case-insensitive)
      query = query.ilike('name', `%${search.trim()}%`);
    }
  }

  if (department && department.trim() !== '') {
    query = query.eq('department', department);
  }

  if (manager && manager.trim() !== '') {
    // Primeiro, buscar o ID do manager pelo nome
    const { data: managerData, error: managerError } = await supabase
      .from('people')
      .select('id')
      .eq('name', manager.trim())
      .single();

    if (!managerError && managerData) {
      // Buscar todas as pessoas que têm esse managerId
      query = query.eq('managerId', managerData.id);
    } else {
      // Se não encontrar o manager, retornar vazio
      return NextResponse.json([]);
    }
  }

  if (type && type.trim() !== '') {
    query = query.eq('employeeType', type);
  }

  if (status && status.trim() !== '') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('API Search - Erro:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}
