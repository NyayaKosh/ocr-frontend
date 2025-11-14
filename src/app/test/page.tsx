"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function TestApi() {
    const [baseURL, setBaseURL] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [method, setMethod] = useState("GET");
    const [body, setBody] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Load baseURL from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("apiTesterBaseURL");
        if (saved) setBaseURL(saved);
    }, []);

    // Save baseURL automatically
    useEffect(() => {
        if (baseURL) localStorage.setItem("apiTesterBaseURL", baseURL);
    }, [baseURL]);

    const handleTest = async () => {
        if (!endpoint && !baseURL) {
            setError("Please enter both Base URL and Endpoint.");
            return;
        }

        const url = endpoint.startsWith("http")
            ? endpoint
            : `${baseURL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                ...(method !== "GET" && body ? { body } : {}),
            });

            const text = await res.text();
            if (!res.ok) throw new Error(`Error ${res.status}: ${text}`);

            try {
                const json = JSON.parse(text);
                setResponse(JSON.stringify(json, null, 2));
            } catch {
                setResponse(text);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>API Tester</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Base URL */}
                <Input
                    placeholder="Base URL (e.g. http://localhost:8000)"
                    value={baseURL}
                    onChange={(e) => setBaseURL(e.target.value)}
                />

                {/* Endpoint + Method */}
                <div className="flex gap-2">
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="border rounded-md p-2 w-28"
                    >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>PATCH</option>
                        <option>DELETE</option>
                    </select>
                    <Input
                        placeholder="Endpoint (e.g. /api/test)"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        className="flex-1"
                    />
                </div>

                {/* Request Body */}
                {method !== "GET" && (
                    <Textarea
                        placeholder='Optional JSON body (e.g. {"key": "value"})'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={4}
                    />
                )}

                {/* Full URL Preview */}
                <p className="text-xs text-muted-foreground break-all">
                    <strong>Request URL:</strong>{" "}
                    {endpoint
                        ? endpoint.startsWith("http")
                            ? endpoint
                            : `${baseURL.replace(/\/$/, "")}/${endpoint.replace(
                                  /^\//,
                                  ""
                              )}`
                        : baseURL || "—"}
                </p>

                {/* Action Button */}
                <Button
                    onClick={handleTest}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />{" "}
                            Testing...
                        </>
                    ) : (
                        "Send Request"
                    )}
                </Button>

                {/* Response Section */}
                {(response || error) && (
                    <div className="mt-4">
                        <p className="font-semibold mb-1">
                            {error ? "❌ Error" : "✅ Response"}
                        </p>
                        <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                            {error || response}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
