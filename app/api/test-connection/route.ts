import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    console.log('🔍 Testando conexão com Supabase...')
    
    // Verificar variáveis de ambiente
    const hasUrl = !!process.env.SUPABASE_URL
    const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('✅ SUPABASE_URL definida:', hasUrl)
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY definida:', hasKey)
    
    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        success: false,
        error: 'Variáveis de ambiente não configuradas',
        hasUrl,
        hasKey
      }, { status: 500 })
    }

    const supabase = getSupabaseClient()
    
    // Tentar buscar dados da tabela people
    const { data, error, count } = await supabase
      .from('people')
      .select('*', { count: 'exact', head: false })
      .limit(5)
    
    if (error) {
      console.error('❌ Erro ao buscar dados:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        hint: 'Verifique se a tabela "people" existe no Supabase e se a service_role key está correta'
      }, { status: 500 })
    }
    
    console.log('✅ Conexão bem-sucedida! Total de registros:', count)
    console.log('📊 Primeiros registros:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase funcionando!',
      totalRecords: count,
      sampleData: data,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
