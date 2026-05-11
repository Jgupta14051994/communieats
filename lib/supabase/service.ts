import { createClient } from '@supabase/supabase-js'

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Use service key if it's a JWT (starts with eyJ), otherwise fall back to anon key
  const key = serviceKey?.startsWith('eyJ') ? serviceKey : anonKey

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
