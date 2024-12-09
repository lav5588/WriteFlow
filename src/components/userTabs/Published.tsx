'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { EllipsisVertical, GalleryThumbnails, Pencil, Trash2, Undo2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
const truncateHTML = (html: string, maxLength: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText || tempDiv.textContent || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const AlertBox = () => {
    return
}

const Published = ({ username }) => {
    const [data, setData] = useState([])
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log(username);
                const response = await axios.get(`/api/blogs/blogs-by-username?username=${username}`);
                console.log("Data fetched: ", response);
                setData(response.data.post);
            } catch (error) {
                console.log("Error in fetching data: ", error);
            }
        }
        if (username) {
            fetchData()
        }

    }, [])

    if (data.length == 0) {
        return <div>There is no published content</div>
    }

    const handleClick = (slug) => {
        router.push(`/blogs/${slug}`)
    };

    return (
        <div className="mt-5">
            <h1 className="text-center font-extrabold text-3xl mb-5">Published</h1>
            <div className="flex flex-wrap gap-5  justify-center items-center">
                {data && data?.map((blog) => (
                    <Card key={blog._id} className="h-[20rem]  w-[20rem]">
                        <CardHeader className="flex flex-row justify-between place-items-start">
                            <CardTitle className="leading-6" onClick={() => { handleClick(blog.slug) }}><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-4 0">
                                    <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem><GalleryThumbnails />View</DropdownMenuItem>
                                    <DropdownMenuItem><Pencil />Edit</DropdownMenuItem>
                                    <DropdownMenuItem><Undo2 />Unpublish</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-400" onClick={(e)=>e.preventDefault()}>
                                        <AlertDialog>
                                            <AlertDialogTrigger className="flex justify-center items-end"><Trash2 className="w-4"/>&nbsp;Delete</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your account
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <div
                                dangerouslySetInnerHTML={{ __html: truncateHTML(blog.content, 200) }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}

export default Published