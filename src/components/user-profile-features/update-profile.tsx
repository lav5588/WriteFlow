'use client'

import { useEffect, useRef, useState } from "react";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PencilLine } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { signIn, useSession } from "next-auth/react";
import { usernameValidation } from "@/schemas/signUpSchema";
import { useRouter } from "next/navigation";
import updateSessionData from "@/lib/updateSessionData";


const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const profileSchema = z.object({
    profileImage: z
        .any()
        .optional(),
    name: z.string().min(3).max(50),
    username: usernameValidation,
    bio: z.string().max(250),
});

export function UpdateProfile({ user, fetchUserData }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [profileImageLink, setProfileImageLink] = useState(user.profileImage);
    const [prImage, setPrImage] = useState("");
    const inputRef = useRef();
    const router = useRouter();
    const session = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            profileImage: "",
            name: user.name,
            username: user.username,
            bio: user.bio,
        },
    });

    useEffect(() => {
        form.reset();
        setPrImage("")
    }, [isOpen]);


    async function onSubmit(values: z.infer<typeof profileSchema>) {
        try {
            setIsSubmitting(true);
            console.log("Form submitted with values:", values);
            console.log("User: ", form.getValues());
            const formData = new FormData();
            formData.append("profileImage", values.profileImage);
            formData.append("name", values.name);
            formData.append("username", values.username);
            formData.append("bio", values.bio);
            const response = await axios.put("/api/update-profile", formData);
            console.log("response: ", response.data);
            if (session.data?.user.username != values.username) {
                router.push(values.username);
            }
            else {
                await fetchUserData();
            }
            await updateSessionData();
        }
        catch (error) {
            console.log("update profile error: ", error);
            toast({
                title: "Failed to update profile",
                variant: 'destructive',
                description: error?.message,
            });
        }
        finally {
            form.reset();
            setIsOpen(false);
            setPrImage("")
            setIsSubmitting(false);
        }

    }

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const newImageUrl = URL.createObjectURL(e.target.files[0]);
            setProfileImageLink(newImageUrl);
            console.log("e.target.files[0]: ", e.target.files[0]);
            setPrImage(e.target.value);
            form.setValue("profileImage", e.target.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current.click();
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsOpen(true)}><PencilLine />Update Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your Profile here. Click save when you're done.
                    </DialogDescription>
                    <div className="flex justify-center items-center flex-col">
                        <Avatar onClick={handleClick} className="h-20 w-20">
                            <AvatarImage src={profileImageLink} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        Profile Picture
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="profileImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="" {...field} type="file"
                                            onChange={handleChange}
                                            value={prImage}
                                            className="hidden"
                                            ref={inputRef}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter your Name" {...field} type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter your Username" {...field} type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Update your Bio" {...field} type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="animate-spin" />Saving</> : "Save"}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
