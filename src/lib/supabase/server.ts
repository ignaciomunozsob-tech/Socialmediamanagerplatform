import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zuictmuvgsytfjpnbtrl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1aWN0bXV2Z3N5dGZqcG5idHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzExNTQsImV4cCI6MjA5NDk0NzE1NH0.iNtSDtLsg80dWigR_iFQaVr6jwELrbvOZne_iMT0CqY";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1aWN0bXV2Z3N5dGZqcG5idHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM3MTE1NCwiZXhwIjoyMDk0OTQ3MTU0fQ.4T8dJwZ7fI0FDLnzJwx5KIvfSdNvQ85VtU30ulWmros";

export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || SUPABASE_ANON_KEY
  );
}

export async function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY || SUPABASE_SERVICE_KEY
  );
}
