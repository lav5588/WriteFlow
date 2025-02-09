'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, PencilLine } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const passWordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6, { message: "password must be at least 6 characters" }).max(20, { message: "password must be at most 12 characters" }),
    confirmNewPassword: z.string().min(6, { message: "password must be at least 6 characters" }).max(20, { message: "password must be at most 12 characters" }),
});

export default function ChangePassword() {
    const router = useRouter();
    const { toast } = useToast();
    const [viewPasswordOld,setViewPasswordOld] = useState(false);
    const [viewPasswordNew,setViewPasswordNew] = useState(false);
    const form = useForm<z.infer<typeof passWordSchema>>({
        resolver: zodResolver(passWordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });
    const [isSubmitting,setIsSubmitting] = useState(false);

    async function onSubmit(values: z.infer<typeof passWordSchema>) {
        console.log("Form submitted with values:", values);
        if (values.newPassword !== values.confirmNewPassword) {
            form.setError("confirmNewPassword", {
                type: "manual",
                message: "Passwords don't match",
            });
            return;
        }
        try {
            setIsSubmitting(true);
            const response = await axios.post("/api/change-password", values);
            console.log("change password response: ", response);
            if (response.status === 200) {
                toast({
                    title: "Password changed successfully",
                });
                router.push('/');
            }
        } catch (error) {
            console.log("change password error: ", error);
            toast({
                title: "Failed to change password",
                variant: 'destructive',
                description: error?.message,
            });
        }
        finally {
            form.reset();
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Make changes to your Password here. Click save when you're done.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Old Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="Enter your old password" {...field} type={viewPasswordOld?'text':'password'} className="pr-10"/>
                                                {!viewPasswordOld && <Eye className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPasswordOld(!viewPasswordOld)} />}
                                                {viewPasswordOld && <EyeOff className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPasswordOld(!viewPasswordOld)} />}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="Enter your new password" {...field} type={viewPasswordNew?'text':'password'} className="pr-10" />
                                                {!viewPasswordNew && <Eye className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPasswordNew(!viewPasswordNew)} />}
                                                {viewPasswordNew && <EyeOff className="absolute top-1 right-1 opacity-50 cursor-pointer" onClick={() => setViewPasswordNew(!viewPasswordNew)} />}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmNewPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your confirm new password" {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting?<><Loader2 className="animate-spin"/>Submitting</>:"Submit"}</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
