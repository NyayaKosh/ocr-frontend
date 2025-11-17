import { createClient } from "@/lib/supabase/server";
import axios from "axios";
import { Env } from "./env";

export async function axiosClientServer() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (!session) throw new Error("User session not found");

    const api = axios.create({
        baseURL: Env.NEXT_PUBLIC_DOCUMENT_SERVICE,
        headers: {
            Authorization: `Bearer ${session.access_token}`,
            "X-User-ID": session.user.id,
        },
        withCredentials: true,
        withXSRFToken: true
    });

    return api;
}
