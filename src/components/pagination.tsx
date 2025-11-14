"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function PaginationComponent({
    totalPages = 1,
}: {
    totalPages?: number;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const currentPage = Number(searchParams.get("page")) || 1;

    const updatePage = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(page));
            router.push(`${pathname}?${params.toString()}`);
            router.refresh();
        },
        [router, pathname, searchParams]
    );

    return (
        <Pagination className="mt-6">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) updatePage(currentPage - 1);
                        }}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href={`?page=${page}`}
                                className="border-0 shadow-none"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    updatePage(page);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                                updatePage(currentPage + 1);
                        }}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
