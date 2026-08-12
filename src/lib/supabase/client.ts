import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Use dummy values as fallback to allow UI to render in demo mode
  // if environment variables are not yet configured.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://mock.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'mock-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
