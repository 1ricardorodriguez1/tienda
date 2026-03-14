import { createClient } from "@supabase/supabase-js";

// En Vercel DEBEN estar definidas VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
// (Supabase → Settings → API). Después de cambiarlas, haz Redeploy.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Simiro Store: Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. " +
      "Configúralas en Vercel (y en .env local) y redeploy."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

