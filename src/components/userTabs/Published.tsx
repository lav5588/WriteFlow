'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { EllipsisVertical, GalleryThumbnails, Pencil, Trash2, Undo2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useSession } from "next-auth/react"
import { deletePublishedBlog, unPublishThePublishedBlog } from "@/network-call/userProfile.networkCall"


const truncateHTML = (html: string, maxLength: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText || tempDiv.textContent || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};



const Published = ({ username, publishedData, fetchPublishedAndUnpublishedData }) => {
    const router = useRouter();
    const session = useSession();



    const handleDelete = async (slug) => {
        await deletePublishedBlog(slug);
        fetchPublishedAndUnpublishedData();
    }

    if (publishedData.length == 0) {
        return <div>There is no published content</div>
    }

    const handleClick = (slug) => {
        router.push(`/blogs/${slug}`)
    };

    const handleEdit = (slug) => {
        router.push(`/draft/${slug}`)
    };


    const handleUnpublish = async (id) => {
        await unPublishThePublishedBlog(id);
        fetchPublishedAndUnpublishedData();
    }



    return (
        <div className="mt-5">
            <h1 className="text-center font-extrabold text-3xl mb-5">Published</h1>
            <div className="flex flex-wrap gap-5  justify-center items-center">
                {publishedData && publishedData?.map((blog) => (
                    <Card key={blog._id} className="h-[20rem]  w-[20rem]">
                        <CardHeader className="flex flex-row justify-between place-items-start">
                            <CardTitle className="leading-6" onClick={() => { handleClick(blog.slug) }}><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                            {session?.data?.user?.username == username && <DropdownMenu>
                                <DropdownMenuTrigger className="w-4 0">
                                    <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => { handleClick(blog.slug) }}><GalleryThumbnails />View</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(blog.slug)}><Pencil />Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUnpublish(blog._id)}><Undo2 />Unpublish</DropdownMenuItem>
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
                            </DropdownMenu>}
                        </CardHeader>
                        <CardContent onClick={() => { handleClick(blog.slug) }}>
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