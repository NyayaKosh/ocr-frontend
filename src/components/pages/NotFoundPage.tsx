import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFoundPage() {
    return (
        <main className="min-h-screen flex items-center justify-center dark:bg-gray-900 px-4">
            <Card className="max-w-3xl w-full shadow-none text-center py-16">
                <CardContent>
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 mx-auto shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" />
                            <path d="M7 9V7a5 5 0 0 1 9.9-1" />
                            <path d="M17 11l4 4" />
                            <circle cx="11" cy="13" r="3" />
                        </svg>
                    </div>

                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                        404
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        We can&apos;t find the page you&apos;re looking for.
                    </p>
                    <p className="max-w-xl mx-auto text-sm text-gray-500 dark:text-gray-400 mb-6">
                        The link may be broken, the page may have moved, or it
                        may never have existed. Try going back home or contact
                        us if you need help.
                    </p>

                    <div className="flex items-center justify-center gap-3">
                        <Link href="/">
                            <Button asChild>Home</Button>
                        </Link>

                        <Link href="/contact-us">
                            <Button variant="outline" asChild>
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
