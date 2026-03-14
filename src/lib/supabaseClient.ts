import { createClient } from "@supabase/supabase-js";

// En Vercel configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (Supabase → Settings → API).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const hasConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("placeholder"));

if (!hasConfig) {
  console.warn(
    "Simiro Store: Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel (Settings → Environment Variables) y haz Redeploy."
  );
}

// Si faltan variables, usamos placeholder para que la app no crashee al cargar (las peticiones fallarán hasta que configures en Vercel).
const url = hasConfig ? SUPABASE_URL : "https://placeholder.supabase.co";
const key = hasConfig ? SUPABASE_ANON_KEY : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDIxNzY4MDAsImV4cCI6MTk1Nzc1MjgwMH0.placeholder";

export const supabase = createClient(url, key);

