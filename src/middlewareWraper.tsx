'use client'
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";


const WithAuth:React.FC<{children:React.ReactNode}> = ({ children }) => {
    const session = useSession();
    const router = useRouter();
    const pathname = usePathname();


    useEffect(() => {
        if (session.status === 'unauthenticated'
            && (pathname.startsWith('/draft')
                || pathname.startsWith('/create')
                || pathname.startsWith('/change-password')
            )) {
            router.push("/sign-in");
        }
        if (session.status === 'authenticated'
            &&
            (pathname.startsWith('/sign-in')
                || pathname.startsWith('/sign-up')
                || pathname.startsWith('/verify')
                || pathname.startsWith('/forgot-password')
            )) {
            router.push("/");
        }
    }, [session, pathname]);

    return children
}

export default WithAuth;