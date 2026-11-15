import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CONFIG } from "@/configs";
import { getAstraLogger } from "astralogger";

let supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
    if (supabase) return supabase;
    const key = CONFIG.supabase.serviceRoleKey || CONFIG.supabase.anonKey;
    if (!CONFIG.supabase.url || !key) {
        getAstraLogger().error("Supabase is not configured on the server (SUPABASE_URL / SUPABASE_ANON_KEY missing)");
        throw new Error("Supabase is not configured on the server");
    }
    supabase = createClient(CONFIG.supabase.url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
    return supabase;
};
