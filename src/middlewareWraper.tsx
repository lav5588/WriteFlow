'use client'
import { useSession } from "next-auth/react";
import {  useRouter,usePathname } from "next/navigation";
import {  useEffect } from "react";


const WithAuth = ({children}) => {
    const session = useSession();
    const router = useRouter();
    const pathname = usePathname();


    useEffect(() => {
        if(session.status === 'unauthenticated'
            &&( pathname.startsWith('/draft')
            || pathname.startsWith('/create')
        )){
            router.push("/sign-in");
        }
        if(session.status === 'authenticated'
            && 
           ( pathname.startsWith('/sign-in') 
            || pathname.startsWith('/sign-up')
            || pathname.startsWith('/verify')
        )){
            router.push("/");
        }
    }, [session, pathname]);
    
  return children
}

export default WithAuth;