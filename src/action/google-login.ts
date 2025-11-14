import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
    const header = await headers()
    const origin = header.get("origin");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`
        },
    });

    if (error) {
        console.error("OAuth error:", error);
        return redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data?.url) {
        return redirect(data.url);
    }
}
