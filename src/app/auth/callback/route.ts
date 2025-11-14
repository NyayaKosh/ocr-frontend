import { createClient } from "@/lib/supabase/server";
import { Env } from "@/utils/env";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    // const nextParam = url.searchParams.get("next") ?? "/";

    const response = NextResponse.redirect(Env.GOOGLE_LOGIN_REDIRECT);

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return response
        }
    }
    return NextResponse.redirect('/login?error=callback_error');
}
