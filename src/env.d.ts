declare namespace NodeJS {
    interface ProcessEnv {
        PROJECT_ID: string

        NEXT_PUBLIC_SUPABASE_URL: string
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: string

        SUPABASE_URL: string
        SUPABASE_PUBLISHABLE_KEY: string
        SUPABASE_ANON_KEY: string
        SUPABASE_SECRET_KEY: string

        DOCUMENT_SERVICE: string
        API_BACKEND: string
        NEXT_PUBLIC_SITE_URL: string
        GOOGLE_LOGIN_REDIRECT: string
    }
}
