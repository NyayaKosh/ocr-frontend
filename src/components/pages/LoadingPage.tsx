import { LucideLoader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <main className="min-h-screen flex items-center justify-center dark:bg-gray-900 px-4">
            <LucideLoader2 className="animate-spin h-8 w-8" /> Loading...
        </main>
    );
}
