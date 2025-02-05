'use client'
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

import { signOut, useSession } from "next-auth/react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";




export const Navbar = () => {

    const session = useSession()
    const { toast } = useToast();
    // const [isopen,setIsOpen] = useState('');

    const handleLogout = async () => {
        try {
            await signOut({
                redirect: false
            });
            toast({
                title: "Logged out successfully",
            });
        } catch (error) {
            console.log("error: " + error);
            toast({
                title: "Failed to logout",
                variant: 'destructive',
                description: error?.message,
            });
        }
    }
    return (
        <nav className="flex items-center justify-between px-6 pt-4 pb-2 mb-2 border-b ">

            <Link href="/" className="text-xl font-bold">
                Write Flow
            </Link>
            <div className="space-x-6 flex items-center">
                <ModeToggle />

                <Link href="/" >
                    Home
                </Link>
                <Link href="/blogs" >
                    Blog
                </Link>

                {!session?.data?.user && <Link href="/sign-in" >
                    Sign In
                </Link>}

                {
                    session?.data?.user && <DropdownMenu >
                        <DropdownMenuTrigger>
                            <User/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{session?.data?.user.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/u/${session?.data?.user.username}`} >
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/change-password`} >
                                    Change Password
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </div>
        </nav>
    );
};
