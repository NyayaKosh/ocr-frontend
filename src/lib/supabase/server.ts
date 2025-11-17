import { Env } from "@/utils/env";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function createClient(): SupabaseClient {
    const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY } = Env

    if (!Env.NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        throw new Error(
            "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY in Railway."
        );
    }

    const cookieStoreOrPromise = cookies();

    async function getCookieStore() {
        return cookieStoreOrPromise instanceof Promise
            ? await cookieStoreOrPromise
            : cookieStoreOrPromise;
    }

    return createServerClient(
        NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll: async () => {
                    const store = await getCookieStore();
                    const allCookies = store.getAll();
                    return allCookies;
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
                    } catch (error) {
                        console.error('[Supabase] Error setting cookies:', error);
                    }
                },
            },
        }
    );
}
