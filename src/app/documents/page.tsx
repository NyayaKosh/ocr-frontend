import * as React from "react";
import { axiosClientServer } from "@/utils/axios-handler-server";
import DocumentTable from "./_documents-table";
import { PaginationComponent } from "@/components/pagination";
import SearchComponent from "@/components/search";

export default async function DocumentsListingViewPage({
    searchParams,
}: PageProps<"/documents">) {
    const searchParam = await searchParams;
    const params = new URLSearchParams(searchParam as Record<string, string>);

    const client = await axiosClientServer();
    const res = await client.get(`/ocr/documents?${params.toString()}`);

    const { results, total_pages } = res.data;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="w-lg">
                    <SearchComponent />
                </div>
            </div>
            <DocumentTable data={results || []} />
            <PaginationComponent totalPages={total_pages} />
        </div>
    );
}
