import { createClient } from "@/lib/supabase/server";
import { Env } from "@/utils/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const code = searchParams.get('code')
    let next = searchParams.get('next') ?? '/'

    const origin = Env.NEXT_PUBLIC_SITE_URL

    if (!next.startsWith('/')) {
        next = '/'
    }

    if (code) {
        const supabase = createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = Env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            console.error('[Auth Callback] Session exchange failed:', error)
        }
    } else {
        console.warn('[Auth Callback] No authorization code received')
    }

    return NextResponse.redirect(`${origin}/login/?error=auth-code-error`)
}