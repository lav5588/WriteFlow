'use client'
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

import {  signOut, useSession } from "next-auth/react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User } from "lucide-react";




export const Navbar = () => {
    
    const session = useSession()
    const handleLogout = async () => {
        try {
            await signOut({
                redirect:false
            });
        } catch (error) {
            console.log("error: " + error);
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
                    session?.data?.user && <DropdownMenu>
                        <DropdownMenuTrigger>
                            <User />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{session?.data?.user.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href={`/u/${session?.data?.user.username}`} >
                                    Profile
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
