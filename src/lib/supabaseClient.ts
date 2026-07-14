import { createClient } from "@supabase/supabase-js";

// Browser-only client, used solely to open the Realtime channel for the
// live player roster. Never used for writes — those go through Drizzle.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
