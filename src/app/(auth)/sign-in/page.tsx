'use client'

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from 'next-auth/react';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


import { useForm } from "react-hook-form"
import { z } from "zod"


const page = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    });
    const { toast } = useToast();
    const [viewPassword, setViewPassword] = useState(false);


    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        try {
            const response = await signIn("credentials", {
                ...values,
                redirect: false,
            })
            console.log("SignIn response: ", response);
            if (response?.error) {
                toast({
                    variant: "destructive",
                    title: "Error signing in",
                    description: response.error,
                })
                throw new Error(response.error);
            }
            toast({
                title: "Signed in successfully",
            })
            router.push('/');

        }
        catch (error) {
            console.error("sign in error", error);
            toast({
                variant: "destructive",
                title: "Error signing in",
                description: error?.message,
            })
        }
    };

    return (
        <div className="flex justify-center flex-col items-center">
            <h1>SIGN IN</h1>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-12">
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="username or email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="password" {...field} type="password" type={viewPassword ? 'text' : 'password'} className="pr-10" />
                                        {!viewPassword && <Eye className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPassword(!viewPassword)} />}
                                        {viewPassword && <EyeOff className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPassword(!viewPassword)} />}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" >Submit</Button>
                </form>
            </Form>
            <Link href={'/forgot-password'} className="underline">Forget Password</Link>
            Don't have an account?
            <Link href={'/sign-up'} className="underline">SignUp</Link>
        </div>
    )
}

export default page