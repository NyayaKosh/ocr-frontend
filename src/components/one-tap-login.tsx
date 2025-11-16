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
        console.log("Nonce: ", nonce, hashedNonce);

        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error getting session", error);
        }
        if (data.session) {
            router.push("/");
            return;
        }

        google.accounts.id.initialize({
            client_id: Env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: async (response: CredentialResponse) => {
                try {
                    const { data, error } =
                        await supabase.auth.signInWithIdToken({
                            provider: "google",
                            token: response.credential,
                            nonce,
                        });

                    if (error) throw error;
                    console.log("Session data: ", data);
                    console.log("Successfully logged in with Google One Tap");

                    router.push("/");
                } catch (error) {
                    console.error(
                        "Error logging in with Google One Tap",
                        error
                    );
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
