import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vrttcihegkdjctrcyyab.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydHRjaWhlZ2tkamN0cmN5eWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzkyMzEsImV4cCI6MjA4OTkxNTIzMX0.gEtJQpq449MijVBZfqYIz8Sp1WDLV-YMVHUZR_c4i0o";

export const supabase = createClient(supabaseUrl, supabaseKey);

