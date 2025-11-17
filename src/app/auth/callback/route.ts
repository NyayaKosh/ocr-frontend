import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)

    console.log("oriign ", origin);

    const code = searchParams.get('code')
    let next = searchParams.get('next') ?? '/'
    if (!next.startsWith('/')) {
        next = '/'
    }

    console.log(request.headers.get('x-forwarded-host'));

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
        }
        }
    }

    console.log(`${origin}/auth/auth-code-error`);

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}