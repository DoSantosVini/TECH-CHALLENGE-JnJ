import "server-only"
import { createClient } from "@supabase/supabase-js"

export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Supabase env vars não configuradas")
  }

  return createClient(url, key)
}