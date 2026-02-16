import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // 返回一个mock客户端，避免运行时错误
    return {
      from: () => ({
        select: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      }),
    } as any;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
