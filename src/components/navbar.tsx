import { createClient } from "@/lib/supabase/server";
import NavbarUserSection from "./navbar-user-section";
import { Home, PackageX } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

const NAV_ROUTES = [
    {
        title: "Home",
        href: "/",
        icon: <Home />,
    },
    {
        title: "Documents",
        href: "/documents",
        icon: <PackageX />,
    },
];

export default async function CustomNavbar() {
    const supabase = createClient();
    const session = await supabase.auth.getSession();

    return (
        <div className="container mx-auto flex justify-between items-center p-2">
            <div className="font-bold flex  gap-2 items-center text-xl text-primary">
                <Image src="/logo.png" alt="Logo" width={140} height={140} />
            </div>

            <div className="flex">
                {NAV_ROUTES.map((route) => (
                    <Button
                        className="font-semibold"
                        variant={"ghost"}
                        asChild
                        key={route.title}
                    >
                        <Link href={route.href}>
                            {route.icon} {route.title}
                        </Link>
                    </Button>
                ))}
            </div>

            <div className="">
                <NavbarUserSection session={session} />
            </div>
        </div>
    );
}
