import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(
            `${request.nextUrl.origin}/login?error=callback_error`
        );
    }

    const response = NextResponse.redirect(request.nextUrl.origin);

    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(
            `${request.nextUrl.origin}/login?error=callback_error`
        );
    }

    return response;
}
