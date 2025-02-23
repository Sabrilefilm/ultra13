
import { createClient } from '@supabase/supabase-js';

// L'URL de votre projet Supabase
const supabaseUrl = 'https://pgprsyoqhvnpmvlxjefa.supabase.co';
// La clé anon publique de votre projet
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncHJzeW9xaHZucG12bHhqZWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTI0MjYsImV4cCI6MjA1NTg4ODQyNn0.j93PPAAEml0E0IucE3ET0VkisidNCYEdM1GQgrJB6cs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
