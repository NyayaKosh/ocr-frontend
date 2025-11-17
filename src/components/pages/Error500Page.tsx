import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
    error?: Error;
    reset?: () => void;
};

export default function Error500Page({ error, reset }: Props) {
    return (
        <main className="min-h-screen flex items-center justify-center dark:bg-gray-900 px-4">
            <Card className="max-w-3xl w-full text-center shadow-none py-16">
                <CardContent>
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500 mb-6 mx-auto shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">
                        Something went wrong
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        An unexpected error occurred. Try refreshing the page or
                        come back later.
                    </p>

                    {error ? (
                        <pre className="text-xs text-left text-red-600 dark:text-red-400 max-w-full overflow-auto rounded-md bg-red-50 dark:bg-red-950 p-3 mb-4">
                            {error.message}
                        </pre>
                    ) : null}

                    <div className="flex items-center justify-center gap-3">
                        <Button
                            onClick={() =>
                                reset ? reset() : window.location.reload()
                            }
                        >
                            Try again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.replace("/")}
                        >
                            Go home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
