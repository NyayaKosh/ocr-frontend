"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Logout() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const supabase = createClient();
        try {
            const { error } = await supabase.auth.signOut({ scope: "global" });
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Logged out successfully");
                window.location.href = "/login";
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Logout failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Button
                variant={"ghost"}
                onClick={handleLogout}
                className="w-full text-start cursor-pointer justify-start"
                disabled={loading}
            >
                <LogOut /> {loading ? "Logging out..." : "Logout"}
            </Button>
        </div>
    );
}
