'use client'

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from 'next-auth/react';
import Link from "next/link"
import { useRouter } from "next/navigation"


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


    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        try {
            await signIn("credentials", {
                ...values,
                redirect:false,
            })
            router.push('/');

        }
        catch (error) {
            console.log("sign in error", error);
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
                                    <Input placeholder="password" {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" >Submit</Button>
                </form>
            </Form>
            Don't have an account? <Link href={'/sign-up'} className="underline">SignUp</Link>
        </div>
    )
}

export default page