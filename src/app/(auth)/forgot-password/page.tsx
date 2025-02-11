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
import { CircleCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';


const identifierSchema = z.object({
    identifier: z.string(),
})

const ForgotPasswordPage: React.FC = () => {
    const {toast} = useToast();
    const [isEmailSent,setIsEmailSent] = useState<boolean>(false);
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false);
    const form = useForm<z.infer<typeof identifierSchema>>({
        resolver: zodResolver(identifierSchema),
        defaultValues: {
            identifier: "",
        },
    })

    async function onSubmit(values: z.infer<typeof identifierSchema>) {
        
        console.log(values);
        try {
            setIsSubmitting(true);
            const response = await axios.get(`/api/forgot-password?identifier=${values.identifier}`);
            console.log(response);
            if(!response){
                toast({
                    variant:'destructive',
                    title:'Error in sending email'  ,
                })
            }
            toast({
                title:'password recovery mail sent to registered email' ,
            });
            setIsEmailSent(true);
        } catch (error) {
            console.error(error);
            toast({
                variant:'destructive',
                title:'Error in sending email'  ,
                description: error instanceof Error? error.message:''
            })
            
        }
        finally{
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[25rem] mx-auto">
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username or Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email or username" {...field} />
                            </FormControl>
                            {isEmailSent && <FormDescription className='text-green-500 flex justify-center items-center gap-2'>
                                We have sent a password recovery email to the registered email address.<CircleCheck />
                            </FormDescription>}
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