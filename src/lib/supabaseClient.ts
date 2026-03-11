import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://nqewwtlkmkoonubikpzq.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "sb_publishable__y-MCPkazugwDUJFa6jixQ_aPdk0geD";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

