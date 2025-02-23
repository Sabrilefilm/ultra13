
import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('VITE_SUPABASE_URL is not defined');
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);
