import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseClient();

  // Buscar todos os dados do banco
  const { data, error } = await supabase
    .from('people')
    .select('*');

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Calcular estatísticas
  const total = data.length;
  const ativos = data.filter((d) => d.status.toLowerCase() === 'active').length;
  const inativos = data.filter((d) => d.status.toLowerCase() === 'inactive').length;
  const employees = data.filter((d) => d.type.toLowerCase() === 'employee').length;
  const partners = data.filter((d) => d.type.toLowerCase() === 'partner').length;
  const gerencias = data.filter((d) => {
    const nivel = (d.jobTitle || '').toLowerCase();
    return nivel.includes('ger') || nivel.includes('diretor') || 
           nivel.includes('manager') || nivel.includes('director') ||
           nivel.includes('vice president') || nivel.includes('vp') ||
           nivel.includes('ceo') || nivel.includes('president');
  }).length;

  return NextResponse.json({ 
    total, 
    ativos, 
    inativos, 
    gerencias, 
    employees, 
    partners 
  });
}
