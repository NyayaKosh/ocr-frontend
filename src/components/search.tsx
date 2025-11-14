"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Search, X } from "lucide-react";

export default function SearchComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("search") || "");

    const updateQueryParam = useCallback(
        (newQuery: string) => {
            const params = new URLSearchParams(window.location.search);
            if (newQuery.trim()) {
                params.set("search", newQuery.trim());
            } else {
                params.delete("search");
            }
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            router.replace(newUrl);
        },
        [router]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateQueryParam(query);
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, updateQueryParam]);

    const handleSearch = useCallback(() => {
        updateQueryParam(query);
    }, [query, updateQueryParam]);

    return (
        <div className="w-full ">
            <InputGroup className="w-full bg-background focus-within:ring-2 focus-within:ring-ring transition-all">
                <InputGroupInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search anything..."
                    className="rounded-l-xl px-4 py-2 text-sm focus-visible:outline-none"
                />
                <InputGroupAddon align="inline-end">
                    {query ? (
                        <InputGroupButton
                            variant="secondary"
                            onClick={() => setQuery("")}
                            className=" flex items-center gap-2 px-4"
                        >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </InputGroupButton>
                    ) : (
                        <InputGroupButton
                            variant="secondary"
                            onClick={handleSearch}
                            className=" flex items-center gap-2 px-4"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:inline">Search</span>
                        </InputGroupButton>
                    )}
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}
