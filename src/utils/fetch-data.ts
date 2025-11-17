
import { Env } from "@/utils/env";

export type FetchParamType = {
    url: string;
    searchParams?: Record<string, unknown>;
    admin?: boolean;
};

export class APIError extends Error {
    status: number;
    body: unknown;

    constructor(message: string, status: number, body: unknown) {
        super(message);
        this.name = "APIError";
        this.status = status;
        this.body = body;
    }
}


export async function fetchData<T>({ url }: FetchParamType): Promise<T> {
    const response = await fetch(`${Env.NEXT_PUBLIC_DOCUMENT_SERVICE}${url}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",

        },
        redirect: "follow",
        referrerPolicy: "no-referrer-when-downgrade"
    });

    if (!response.ok) {
        let body: unknown = null;
        try {
            body = await response.json();
        } catch {
            // body = await response.text();
        }
        throw new APIError(
            `Request failed: ${response.status} ${response.statusText}`,
            response.status,
            body
        );
    }

    return response.json() as Promise<T>;
}


export interface MutateParamType {
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    signal?: AbortSignal;
    headers?: HeadersInit;
    admin?: boolean
}


export async function mutateData<T>(params: MutateParamType): Promise<T> {
    const { url, method, body, signal, headers = {} } = params;

    let finalBody: BodyInit | undefined = undefined;
    const finalHeaders = new Headers(headers);

    if (body instanceof FormData || typeof body === "string" || body instanceof Blob) {
        finalBody = body as BodyInit;
    } else if (body !== undefined) {
        finalBody = JSON.stringify(body);
        if (!finalHeaders.has("Content-Type")) {
            finalHeaders.set("Content-Type", "application/json");
        }
    }

    try {
        const endpoint = `${Env.NEXT_PUBLIC_DOCUMENT_SERVICE}${url}`

        const response = await fetch(endpoint, {
            method,
            body: finalBody,
            headers: finalHeaders,
            credentials: "include",
            signal,
        });

        let parsed: Record<string, unknown> | string;
        const rawText = await response.text();

        try {
            parsed = JSON.parse(rawText);
        } catch {
            parsed = rawText;
        }

        if (!response.ok) {
            const msg =
                typeof parsed === "object" && parsed !== null && "message" in parsed
                    ? String((parsed as Record<string, unknown>)["message"])
                    : `Request failed: ${response.status} ${response.statusText}`;

            throw new APIError(msg, response.status, parsed);
        }

        if (parsed && typeof parsed === "object" && "success" in parsed && (parsed as Record<string, unknown>)["success"] === false) {
            throw new APIError(
                String((parsed as Record<string, unknown>)["message"]) || "Request unsuccessful",
                response.status,
                parsed
            );
        }

        return parsed as T;
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
            throw new APIError("Request aborted", 0, null);
        }
        throw err;
    }
}
