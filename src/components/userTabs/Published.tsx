'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { EllipsisVertical, GalleryThumbnails, Loader2, Pencil, Trash2, Undo2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useSession } from "next-auth/react"
import { deletePublishedBlog, unPublishThePublishedBlog } from "@/network-call/userProfile.networkCall"
import { useState } from "react";
import { IBlog } from "@/types/blog";
import { truncateHTML } from "@/lib/truncateHtml";



interface IPublishedComponentProps{
    username: string;
    publishedData: IBlog[];
    fetchPublishedAndUnpublishedData: () => Promise<void>;
}

const Published:React.FC<IPublishedComponentProps> = ({ username, publishedData, fetchPublishedAndUnpublishedData }) => {
    const router = useRouter();
    const session = useSession();
    const [isUnPublishing, setIsUnPublishing] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)


    const handleDelete = async (slug:string) => {
        await deletePublishedBlog(slug,setIsDeleting);
        fetchPublishedAndUnpublishedData();
    }

    if (publishedData.length == 0) {
        return <div>There is no published content</div>
    }

    const handleClick = (slug:string) => {
        router.push(`/blogs/${slug}`)
    };

    const handleEdit = (slug:string) => {
        router.push(`/draft/${slug}`)
    };


    const handleUnpublish = async (id:string) => {
        await unPublishThePublishedBlog(id,setIsUnPublishing);
        fetchPublishedAndUnpublishedData();
    }



    return (
        <div className="mt-5">
            <h1 className="text-center font-extrabold text-3xl mb-5">Published</h1>
            <div className="flex flex-wrap gap-5  justify-center items-center">
                {publishedData && publishedData?.map((blog) => (
                    <Card key={blog._id} className="h-[26rem]  w-[20rem]">
                        <CardHeader className="flex flex-row justify-between place-items-start">
                            <CardTitle className="leading-6" onClick={() => { handleClick(blog.slug) }}><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                            {session?.data?.user?.username == username && <DropdownMenu>
                                <DropdownMenuTrigger className="w-4 0">
                                    <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => { handleClick(blog.slug) }}><GalleryThumbnails />View</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(blog.slug)}><Pencil />Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUnpublish(blog._id)} disabled = {isUnPublishing}>{isUnPublishing?<><Loader2 className="animate-spin"/>Unpublishing</>:<><Undo2 />Unpublish</>}</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-400" onClick={(e) => e.preventDefault()}>
                                        <AlertDialog>
                                            <AlertDialogTrigger className="flex justify-center items-end" ><Trash2 className="w-4" />&nbsp;Delete</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this blog
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(blog.slug)} className="text-red-500" disabled={isDeleting}>{isDeleting?<><Loader2 className="animate-spin"/>Deleting</>:<><Trash2/>Delete</>}</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>}
                        </CardHeader>
                        <CardContent onClick={() => { handleClick(blog.slug) }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: truncateHTML(blog.content, 100) }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}

export default Published