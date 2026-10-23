import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CONFIG } from "@/configs";
import { getAstraLogger } from "astralogger";

let supabase: SupabaseClient | null = null;

// Lazily created so the service still boots without Supabase configured;
// protected routes fail closed (500) until SUPABASE_URL/ANON_KEY are set.
export const getSupabase = (): SupabaseClient => {
    if (supabase) return supabase;
    if (!CONFIG.supabase.url || !CONFIG.supabase.anonKey) {
        getAstraLogger().error("Supabase is not configured on the server (SUPABASE_URL / SUPABASE_ANON_KEY missing)");
        throw new Error("Authentication is not configured on the server");
    }
    supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
    return supabase;
};
