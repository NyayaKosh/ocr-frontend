import { createClient } from "@/lib/supabase/client";
import axios from "axios";
import { Env } from "./env";

export async function axiosClient() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (!session) throw new Error("User session not found");

    const headers = {
        Authorization: `Bearer ${session.access_token}`,
        "X-User-ID": session.user.id,
    }

    const res = await axios.get(`${Env.API_BACKEND}/csrf`, { headers, withCredentials: true })

    const api = axios.create({
        baseURL: Env.API_BACKEND,
        headers: { ...headers, "X-CSRFToken": res.data?.csrfToken },
        withCredentials: true,
    });

    return api;
}
