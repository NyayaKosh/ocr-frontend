import { createClient } from "@/lib/supabase/server";
import { Env } from "@/utils/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const code = searchParams.get('code')
    let next = searchParams.get('next') ?? '/'

    const origin = Env.NEXT_PUBLIC_SITE_URL

    console.log('[Auth Callback] Request received', { code: !!code, next, origin })

    if (!next.startsWith('/')) {
        next = '/'
    }

    if (code) {
        const supabase = createClient()
        console.log('[Auth Callback] Exchanging code for session')
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            console.log('[Auth Callback] Session exchange successful, redirecting to:', next)
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                console.log('[Auth Callback] Local environment detected')
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                console.log('[Auth Callback] Production environment with forwarded host:', forwardedHost)
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                console.log('[Auth Callback] Production environment without forwarded host')
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            console.error('[Auth Callback] Session exchange failed:', error)
        }
    } else {
        console.warn('[Auth Callback] No authorization code received')
    }

    console.log('[Auth Callback] Redirecting to error page')
    return NextResponse.redirect(`${origin}/login/?error=auth-code-error`)
}