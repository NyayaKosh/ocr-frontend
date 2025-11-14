import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/fetch-data";

export type FetchQueryParams<TData, TSelected = TData> = {
    /** Unique query key (array recommended) */
    queryKey: (string | number)[];
    /** API endpoint or full URL */
    url: string;
    /** Transform server response */
    // select?: (data: TData) => TSelected;
    /** Additional react-query options */
    options?: Omit<UseQueryOptions<TData, Error, TSelected>, "queryKey" | "queryFn">;
    /** Whether to use admin fetch */
    admin?: boolean;
};

/**
 * Generic fetcher hook wrapping React Query
 */
export function useFetchQuery<TData = unknown, TSelected = TData>({
    queryKey,
    url,
    options,
    admin = true,
}: FetchQueryParams<TData, TSelected>): UseQueryResult<TSelected, Error> {
    return useQuery<TData, Error, TSelected>({
        queryKey,
        queryFn: async () => {
            const response = await fetchData<TData>({ url, admin });
            return response;
        },
        ...options,
    });
}