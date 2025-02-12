'use client'
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect } from "react";
import updateSessionData from "@/lib/updateSessionData";




export const Navbar:React.FC = () => {

    const session = useSession()
    const { toast } = useToast();
    
    console.log("session", session)

    const handleLogout = async ():Promise<void> => {
        try {
            await signOut({
                redirect: false
            });
            toast({
                title: "Logged out successfully",
            });
        } catch (error:unknown) {
            console.log("error: " + error);
            toast({
                title: "Failed to logout",
                variant: 'destructive',
                description: error instanceof Error? error.message:'',
            });
        }
    }
    useEffect(() => {
        updateSessionData()
    },[])

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
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={session?.data?.user?.profileImage} alt={session?.data?.user.username} />
                                <AvatarFallback >{session?.data?.user.username[0].toLocaleUpperCase()}</AvatarFallback>
                            </Avatar>
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
