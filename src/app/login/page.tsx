"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const supabase = createClient();

    async function handleGoogleLogin() {
        setLoading(true);
        setErrorMsg(null);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    skipBrowserRedirect: true,
                },
            });

            if (error) {
                setErrorMsg(error.message);
                setLoading(false);
                return;
            }
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setErrorMsg((err as Error).message);
            setLoading(false);
        }
    }

    return (
        <div className="h-[calc(100vh_-_6rem)] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-sm bg-white rounded-2xl p-8 border "
            >
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-full">
                        <Shield className="w-7 h-7 text-gray-600" />
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Sign in to your account
                    </h1>
                    <p className="text-sm text-gray-500 text-center">
                        Use your Google account to securely sign in.
                    </p>

                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-4 py-2 text-center"
                        >
                            {errorMsg}
                        </motion.div>
                    )}

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full  text-gray-600 hover:bg-gray-50 shadow-none flex bg-white border items-center justify-center gap-2 py-2.5"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <Image
                                    src={"/google.svg"}
                                    height={20}
                                    width={20}
                                    alt="google-logo"
                                />
                                Sign in with Google
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-gray-400 pt-2">
                        By continuing, you agree to our{" "}
                        <a
                            href="/terms"
                            className="text-blue-600 hover:underline"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="/privacy"
                            className="text-blue-600 hover:underline"
                        >
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
