
import { toast } from "@/hooks/use-toast";
import axios from "axios";


export async function fetchUserDataByUserName(username:string) {
    try {
        const response = await axios.get(`/api/u/${username}`);
        if (!response) {
            console.log("No user found with this username");
            toast({
                variant: "destructive",
                title: "No user found with this username",
            })
            return;
        }
        return response.data;
    } catch (error:unknown) {
        console.log("Error in fetching user data: ", error);
        toast({
            variant: "destructive",
            title: "Error fetching user data",
            description: error instanceof Error ? error.message :"",
        })

    }
}

export async function fetchDraftData() {

    try {
        const response = await axios.get('/api/drafts');
        return response.data;
    } catch (error:unknown) {
        toast({
            title: "Failed to fetch drafts",
            variant: 'destructive',
            description: error instanceof Error ? error.message :"",
        });
        console.log("Error in fetching data: ", error);
    }
}

export async function deleteDraft(slug:string,setIsDeleting:(val:boolean)=>void) {

    try {
        setIsDeleting(true);
        const response = await axios.delete(`/api/delete-blog/${slug}`);
        if (!response) {
            console.log("Error in deleting blog");
            toast({
                title: "Failed to delete blog",
                variant: 'destructive',
            });
        }
        toast({
            title: "Blog deleted successfully",
        });
        return response.data;
    }
    catch (error:unknown) {
        toast({
            title: "Failed to delete blog",
            variant: 'destructive',
            description: error instanceof Error ? error.message :"",
        });
        console.log("Error in deleting data: ", error);
    }
    finally{
        setIsDeleting(false);
    }
}

export async function publishDraft(id:string,setIsPublishing:(val:boolean)=>void) {

    try {
        if (!id) {
            toast({
                title: "Id is required",
                variant: 'destructive',
            });
            throw new Error("Id is required");
        }
        setIsPublishing(true);
        const response = await axios.get('/api/publish', { params: { id } });
        if (!response) {
            toast({
                title: "Failed to publish blog",
                variant: 'destructive',
            });
            return;
        }
        console.log('Blog Published successfully', response);
        toast({
            title: "Blog Published successfully",
        });
    }
    catch (error:unknown) {
        toast({
            title: "Failed to publish blog",
            variant: 'destructive',
            description: error instanceof Error ? error.message :"",
        });
        console.log(error);
    }
    finally{
        setIsPublishing(false);
    }
}

export async function fetchPublishedData(username:string) {
    console.log('hello from publish');
    try {
        const response = await axios.get(`/api/blogs/blogs-by-username?username=${username}`);;
        return response.data.post;
    } catch (error:unknown) {
        console.log("Error in fetching data: ", error);
        toast({
            title: "Failed to fetch published blogs",
            variant: 'destructive',
            description: error instanceof Error ? error.message :"",
        });
    }
}

export async function deletePublishedBlog(slug:string,setIsDeleting:(val:boolean)=>void) {

    try {
        setIsDeleting(true);
        const response = await axios.delete(`/api/delete-blog/${slug}`);
        if (!response) {
            console.log("Error in deleting blog");
            toast({
                title: "Failed to delete blog",
                variant: 'destructive',
            });
        }
        console.log("response: ", response)
        toast({
            title: "Blog deleted successfully",
        });
    }
    catch (error:unknown) {
        console.log("Error in deleting data: ", error);
        toast({
            title: "Failed to delete blog",
            variant: 'destructive',
            description: error instanceof Error ? error.message :"",
        });
    }
    finally{
        setIsDeleting(false);
    }
}

export async function unPublishThePublishedBlog(id:string,setIsUnPublishing:(val:boolean)=>void) {

    try {
        // console.log("hello");
        if (!id) {
            console.log("id is required");
            toast({
                title: "Id is required",
                variant: 'destructive',
            });
            throw new Error("Id is required");
        }
        setIsUnPublishing(true)
        const response = await axios.get('/api/publish', { params: { id } });
        if (!response) {
            console.log('Error unpublishing blog', response);
            toast({
                title: "Failed to unpublish blog",
                variant: 'destructive',
            });
            return;
        }
        toast({
            title: "Blog Unpublished successfully",
        });
        console.log('Blog Unpublished successfully', response);
    }
    catch (error:unknown) {
        console.log(error);
        toast({
            title: "Failed to unpublish blog",
            variant: 'destructive',
            description: error instanceof Error ? error.message :"",
        });
    }
    finally{
        setIsUnPublishing(false);
    }
}