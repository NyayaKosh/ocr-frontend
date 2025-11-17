import { Env } from '@/utils/env';
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = Env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = Env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
        );
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}