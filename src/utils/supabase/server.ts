import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 Anon Key를 환경 변수에 설정해주세요.')
}

// 서버 측에서 사용할 Supabase 클라이언트
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

