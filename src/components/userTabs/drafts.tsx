'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { EllipsisVertical, GalleryThumbnails, Loader2, Pencil, Rss, Trash2, Undo2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteDraft, publishDraft } from "@/network-call/userProfile.networkCall"
import { IBlog } from "@/types/blog"

const truncateHTML = (html: string, maxLength: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText || tempDiv.textContent || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

interface IDraftComponentProps{
    draftData:IBlog[];
    fetchPublishedAndUnpublishedData: () => Promise<void>;
}

const Drafts:React.FC<IDraftComponentProps> = ({ draftData, fetchPublishedAndUnpublishedData }) => {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    

    if (draftData.length == 0) {
        return <div>There is no drafts</div>
    }

    const handleClick = (slug:string) => {
        router.push(`/draft/${slug}`)
    };

    const handleDelete = async (slug:string) => {
        await deleteDraft(slug,setIsDeleting);
        fetchPublishedAndUnpublishedData();
    }

    const handleEdit = (slug:string) => {
        router.push(`/draft/${slug}`)
    };

    const handlePublish = async (id:string) => {
        await publishDraft(id,setIsPublishing);
        fetchPublishedAndUnpublishedData();
    }

    const handlePreview = (slug:string) => {
        router.push(`/blogs/${slug}`)
    };

    return (
        <div className="mt-5">
            <h1 className="text-center font-extrabold text-3xl mb-5">Drafts</h1>
            <div className="flex flex-wrap gap-5  justify-center items-center">
                {draftData.map((blog) => (
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
                                    <DropdownMenuItem onClick={() => handlePublish(blog._id)} disabled={isPublishing}>{isPublishing?<><Loader2 className="animate-spin"/>Publishing</>:<><Rss />Publish</>}</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-400" onClick={(e) => e.preventDefault()}>
                                        <AlertDialog>
                                            <AlertDialogTrigger className="flex justify-center items-end" ><Trash2 className="w-4" />&nbsp;Delete</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your this blog
                                                        and remove blog data from our servers.
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