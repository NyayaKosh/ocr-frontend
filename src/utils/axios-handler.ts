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

    const res = await axios.get(`${Env.DOCUMENT_SERVICE}/csrf`, { headers, withCredentials: true })

    return axios.create({
        baseURL: Env.DOCUMENT_SERVICE,
        headers: { ...headers, "X-CSRFToken": res.data?.csrfToken },
        withCredentials: true,
    });
}
