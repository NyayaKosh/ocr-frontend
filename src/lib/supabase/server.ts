import { Env } from "@/utils/env";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function createClient(): SupabaseClient {
    const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY } = Env

    if (!Env.NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        console.error('[Supabase] Missing environment variables');
        throw new Error(
            "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY in Railway."
        );
    }
    console.log('[Supabase] Creating server client with URL:', NEXT_PUBLIC_SUPABASE_URL);

    const cookieStoreOrPromise = cookies();
    console.log('[Supabase] Cookie store type:', cookieStoreOrPromise instanceof Promise ? 'Promise' : 'Sync');

    console.log('[Supabase Env] Env ', NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
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
                    console.log('[Supabase] Retrieving cookies, count:', allCookies.length);
                    return allCookies;
                },

                setAll: async (
                    cookiesToSet: {
                        name: string;
                        value: string;
                        options?: CookieOptions;
                    }[]
                ) => {
                    console.log('[Supabase] Setting cookies, count:', cookiesToSet.length);
                    const store = await getCookieStore();

                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            console.log('[Supabase] Setting cookie:', name);
                            store.set(name, value, options);
                        });
                    } catch (error) {
                        console.error('[Supabase] Error setting cookies:', error);
                        // safe to ignore in RSC
                    }
                },
            },
        }
    );
}
