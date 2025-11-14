import * as React from "react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthError, Session } from "@supabase/supabase-js";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import Logout from "./logout-button";
import { ChevronDownIcon, LogIn } from "lucide-react";

type SupabaseSessionType =
    | {
          data: {
              session: Session;
          };
          error: null;
      }
    | {
          data: {
              session: null;
          };
          error: AuthError;
      }
    | {
          data: {
              session: null;
          };
          error: null;
      };

export default function NavbarUserSection(props: {
    session: SupabaseSessionType;
}) {
    const { data } = props.session;

    if (!data.session) {
        return (
            <Button variant={"outline"} asChild>
                <Link href={"/login"}>
                    {" "}
                    <LogIn /> Login or signup
                </Link>
            </Button>
        );
    }

    const { user } = data.session;
    const { user_metadata } = user;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="shadow-0">
                    <UserProfile image={user_metadata.picture} />{" "}
                    {user_metadata.name}
                    <ChevronDownIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Action center</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Logout />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const UserProfile = ({ image }: { image: string }) => {
    return (
        <Avatar>
            <Image src={image} alt="user" width={100} height={100} />
        </Avatar>
    );
};
