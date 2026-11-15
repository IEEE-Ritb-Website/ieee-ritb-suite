import { getSupabase } from "@/utils/supabase";
import { getAstraLogger } from "astralogger";

export const connectToDatabase = async () => {
    const supabase = getSupabase();
    try {
        const { error } = await supabase.from("projects").select("id").limit(1);
        if (error && error.code !== "PGRST205") {
            getAstraLogger().warn({ err: error }, "Supabase database returned notice");
        } else {
            getAstraLogger().info("Supabase database client initialized");
        }
    } catch (err) {
        getAstraLogger().warn({ err }, "Could not reach Supabase during startup");
    }
    return supabase;
};

export const getDb = () => {
    return getSupabase();
};
