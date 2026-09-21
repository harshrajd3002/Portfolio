import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://alidhyghcdabmjpepeca.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsaWRoeWdoY2RhYm1qcGVwZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMTExMzAsImV4cCI6MjEwNTU4NzEzMH0.PcNov-7zrOFMG0CnKLMWmGj6n115KHL9lujsqOf39ow'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
