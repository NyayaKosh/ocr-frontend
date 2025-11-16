import { Env } from "@/utils/env";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function createClient(): SupabaseClient {
    // Validate environment variables
    if (!Env.SUPABASE_URL || !Env.SUPABASE_ANON_KEY) {
        throw new Error(
            "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY in Railway."
        );
    }

    // cookies() may be synchronous (Node) OR a Promise (Edge)
    const cookieStoreOrPromise = cookies();

    // Normalize both cases into a Promise
    async function getCookieStore() {
        return cookieStoreOrPromise instanceof Promise
            ? await cookieStoreOrPromise
            : cookieStoreOrPromise;
    }

    return createServerClient(
        Env.SUPABASE_URL,
        Env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: async () => {
                    const store = await getCookieStore();
                    return store.getAll();
                },

                setAll: async (
                    cookiesToSet: {
                        name: string;
                        value: string;
                        options?: CookieOptions;
                    }[]
                ) => {
                    const store = await getCookieStore();

                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            store.set(name, value, options);
                        });
                    } catch {
                        // safe to ignore in RSC
                    }
                },
            },
        }
    );
}
