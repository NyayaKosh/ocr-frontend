import { createClient } from "@/lib/supabase/server";
import axios from "axios";
import { Env } from "./env";

export async function axiosClientServer() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) throw new Error("User not authenticated");
    
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
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
