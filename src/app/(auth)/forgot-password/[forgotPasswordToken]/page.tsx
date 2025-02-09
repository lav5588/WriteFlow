"use client"

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { Badge, CircleCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const emailSchema = z.object({
    newPassword: z.string().min(6, { message: "password should be atleast 6 characters" }).max(20, { message: "password should be atmost 20 characters" }),
    confirmPassword: z.string().min(6, { message: "password should be atleast 6 characters" }).max(20, { message: "password should be atmost 20 characters" }),
})

const ForgotPasswordPage: React.FC = () => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })
    const [viewPassword, setViewPassword] = useState(false);
    const [isSubmitting,setIsSubmitting] = useState(false);

    async function onSubmit(values: z.infer<typeof emailSchema>) {
        if (values.newPassword !== values.confirmPassword) {
            form.setError("confirmPassword", { message: "passwords do not match" });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post(`/api/forgot-password`, values);
            if (!response) {
                toast({
                    variant: 'destructive',
                    title: 'Error in changing password',
                })
            }
            toast({
                title: 'Password changed successfully',
            });
            router.push('/sign-in');

        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Invalid link',
                description: error?.message,
            })
        }
        finally {
            setIsSubmitting(false);
        }

    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[25rem] mx-auto">
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input placeholder="enter new password" {...field} type={viewPassword ? 'text' : 'password'} className="pr-10" />
                                    {!viewPassword && <Eye className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPassword(!viewPassword)} />}
                                    {viewPassword && <EyeOff className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPassword(!viewPassword)} />}
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
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="confirm your password" {...field} type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting?<><Loader2 className="animate-spin"/>Submitting</>:"Submit"}</Button>
            </form>
        </Form>
    )
};

export default ForgotPasswordPage;