import { signIn } from "next-auth/react";

export default async function updateSessionData(){
    try {
        await signIn("credentials",{identifier:"", password:"",redirect: false});
    } catch (error) {
        console.log(error);
    }
}