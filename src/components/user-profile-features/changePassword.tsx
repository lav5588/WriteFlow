'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const passWordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6, { message: "password must be at least 6 characters" }).max(20, { message: "password must be at most 12 characters" }),
    confirmNewPassword: z.string().min(6, { message: "password must be at least 6 characters" }).max(20, { message: "password must be at most 12 characters" }),
});

export function ChangePassword() {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof passWordSchema>>({
        resolver: zodResolver(passWordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    async function  onSubmit(values: z.infer<typeof passWordSchema>) {
        console.log("Form submitted with values:", values);
        if(values.newPassword !== values.confirmNewPassword) {
            form.setError("confirmNewPassword", {
                type: "manual",
                message: "Passwords don't match",
            });
            return;
        }
        try {
            const response = await axios.post("/api/change-password", values);
            console.log("change password response: ", response);
            if(response.status === 200) {
                alert("Password changed successfully");
            }
            
        } catch (error) {
            console.log("change password error: ", error);
        }
        finally{
            form.reset(); 
            setIsOpen(false); // Close the dialog
        }

    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsOpen(true)}>Change Password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Make changes to your Password here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your old password" {...field} type="password" />
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
                                        <Input placeholder="Enter your new password" {...field} type="password" />
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
                        
                    
                        
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
