'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


const page:React.FC = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });
    const { toast } = useToast();
    const [viewPassword,setViewPassword] = useState<boolean>(false);
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false);

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        console.log(values);
        try {
            setIsSubmitting(true);
            const response = await axios.post('/api/sign-up', values)
            if (!response) {
                console.log('Error signing up user', response);
                toast({
                    title: 'Error signing up user',
                    variant: 'destructive'
                })
            }
            console.log("response in signing up: ", response);
            router.push(`/verify/${values.username}`)
        }
        catch (error:unknown) {
            console.error(error);
            toast({
                title: 'Error signing up user',
                description: error instanceof Error ? error.message :'',
                variant: 'destructive'
            })
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center">
            <h1>SIGN UP</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
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
                                        <Input placeholder="password" {...field} type={viewPassword?'text':'password'} className="pr-10"/>
                                        {!viewPassword &&<Eye className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={()=>setViewPassword(!viewPassword)}/>}
                                        {viewPassword && <EyeOff className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={()=>setViewPassword(!viewPassword)}/>}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="confirm password" {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting?<><Loader2 className="animate-spin"/>Submitting</>:"Submit"}</Button>
                </form>
            </Form>
            <Link href={'/forgot-password'} className="underline">Forget Password</Link>
            Already have an account? <Link href={'/sign-in'} className="underline">SignIn</Link>
        </div>
    )
}

export default page