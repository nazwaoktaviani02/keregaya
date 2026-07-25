import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function ensureAnonymousSession() {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('Failed to create anonymous session:', error)
      return null
    }
    return data.session
  }
  
  return session
}