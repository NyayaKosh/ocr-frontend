import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    // const nextParam = url.searchParams.get("next") ?? "/";

    const response = NextResponse.redirect("http://localhost:3001/");

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return response
        }
    }
    return NextResponse.redirect('/login?error=callback_error');
}
