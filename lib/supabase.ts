import "server-only"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient() {
  // Retorna instância em cache se já existir
  if (supabaseInstance) {
    return supabaseInstance
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas. " +
      "Crie um arquivo .env.local na raiz do projeto com essas variáveis."
    )
  }

  // Cria e armazena a instância
  supabaseInstance = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return supabaseInstance
}