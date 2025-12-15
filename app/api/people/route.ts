import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    console.log('📞 API /api/people chamada')
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("people")
      .select("*")

    if (error) {
      console.error('❌ Erro ao buscar people:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Retornando ${data?.length || 0} registros`)
    return Response.json(data)
  } catch (err: any) {
    console.error('❌ Erro inesperado em /api/people:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}