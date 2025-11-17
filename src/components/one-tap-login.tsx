"use client";

import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import type { accounts, CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { Env } from "@/utils/env";

declare const google: { accounts: accounts };

const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
        String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return [nonce, hashedNonce];
};

const OneTapComponent = () => {
    const supabase = createClient();
    const router = useRouter();

    const initializeGoogleOneTap = async () => {
        const [nonce, hashedNonce] = await generateNonce();

        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Error getting user", error);
        }
        if (data.user) {
            router.push("/");
            return;
        }

        google.accounts.id.initialize({
            client_id: Env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: async (response: CredentialResponse) => {
                try {
                    const { error } = await supabase.auth.signInWithIdToken({
                        provider: "google",
                        token: response.credential,
                        nonce,
                    });

                    if (error) throw error;
                    router.push("/");
                } catch {
                    console.error("Error logging in with Google One Tap");
                }
            },
            nonce: hashedNonce,
            use_fedcm_for_prompt: true,
        });
        google.accounts.id.prompt();
    };

    return (
        <Script
            onReady={void initializeGoogleOneTap}
            src="https://accounts.google.com/gsi/client"
        />
    );
};

export default OneTapComponent;
