import { createClient } from "@/lib/supabase/client";
import axios from "axios";
import { Env } from "./env";

export async function axiosClient() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) throw new Error("User not authenticated");
    
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) throw new Error("User session not found");

    const headers = {
        Authorization: `Bearer ${session.access_token}`,
        "X-User-ID": session.user.id,
    }

    const { data } = await axios.get(`${Env.NEXT_PUBLIC_DOCUMENT_SERVICE}/csrf`, { headers, withCredentials: true })

    return axios.create({
        baseURL: Env.NEXT_PUBLIC_DOCUMENT_SERVICE,
        headers: { ...headers, "X-CSRFToken": data?.csrfToken },
        withCredentials: true,
    });
}
