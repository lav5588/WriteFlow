'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { EllipsisVertical, GalleryThumbnails, Pencil, Rss, Trash2, Undo2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

const truncateHTML = (html: string, maxLength: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText || tempDiv.textContent || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Drafts = () => {
    const [data, setData] = useState([])
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/drafts');
            console.log("Data fetched: ", response);
            setData(response.data);
        } catch (error) {
            console.log("Error in fetching data: ", error);
        }
    }

    useEffect(() => {
        
        fetchData()
    }, [])

    if (data.length == 0) {
        return <div>There is no drafts</div>
    }

    const handleClick = (slug) => {
        router.push(`/draft/${slug}`)
    };

    const handleDelete = async (slug) => {
        try {
            const response = await axios.delete(`/api/delete-blog/${slug}`); 
            if(!response){
                console.log("Error in deleting blog");
            }
            console.log("response: " , response)
            fetchData();
        }
        catch (error) {
            console.log("Error in deleting data: ", error);
        }
    }
    const handleEdit = (slug) => {
        router.push(`/draft/${slug}`)
    };
    const handlePublish = async (id) => {
        try {
            // console.log("hello");
            if(!id){
                console.log("id is required");
                throw new Error("Id is required");
            }
            
            const response = await axios.get('/api/publish', {  params: { id } });
            if (!response) {
                console.log('Error publishing blog', response);
                return;
            }
            console.log('Blog Published successfully', response);
            fetchData();
        }
        catch (err) {
            console.log(err);
        }
    }
    const handlePreview = (slug) => {
        router.push(`/blogs/${slug}`)
    };
    return (
        <div className="mt-5">
            <h1 className="text-center font-extrabold text-3xl mb-5">Drafts</h1>
            <div className="flex flex-wrap gap-5  justify-center items-center">
                {data.map((blog) => (
                    <Card key={blog._id} className="h-[20rem]  w-[20rem]" >
                        <CardHeader className="flex flex-row justify-between place-items-start">
                            <CardTitle className="leading-6" onClick={() => { handlePreview(blog.slug) }}><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-4 0">
                                    <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => { handlePreview(blog.slug) }}><GalleryThumbnails />Preview</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(blog.slug)}><Pencil />Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handlePublish(blog._id)}><Rss />Publish</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-400" onClick={(e) => e.preventDefault()}>
                                        <AlertDialog>
                                            <AlertDialogTrigger className="flex justify-center items-end" ><Trash2 className="w-4" />&nbsp;Delete</AlertDialogTrigger>
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
                                                    <AlertDialogAction onClick={() => handleDelete(blog.slug)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent onClick={() => { handlePreview(blog.slug) }}>
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

export default Drafts