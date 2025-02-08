
import { toast } from "@/hooks/use-toast";
import axios from "axios";


export async function fetchUserDataByUserName(username) {
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
    } catch (error) {
        console.log("Error in fetching user data: ", error);
        toast({
            variant: "destructive",
            title: "Error fetching user data",
            description: error?.message,
        })

    }
}

export async function fetchDraftData() {

    try {
        const response = await axios.get('/api/drafts');
        return response.data;
    } catch (error) {
        toast({
            title: "Failed to fetch drafts",
            variant: 'destructive',
            description: error?.message,
        });
        console.log("Error in fetching data: ", error);
    }
}

export async function deleteDraft(slug) {

    try {
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
    catch (error) {
        toast({
            title: "Failed to delete blog",
            variant: 'destructive',
            description: error?.message,
        });
        console.log("Error in deleting data: ", error);
    }
}

export async function publishDraft(id) {

    try {
        if (!id) {
            toast({
                title: "Id is required",
                variant: 'destructive',
            });
            throw new Error("Id is required");
        }
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
    catch (err) {
        toast({
            title: "Failed to publish blog",
            variant: 'destructive',
            description: err?.message,
        });
        console.log(err);
    }
}

export async function fetchPublishedData(username) {
    console.log('hello from publish');
    try {
        const response = await axios.get(`/api/blogs/blogs-by-username?username=${username}`);;
        return response.data.post;
    } catch (error) {
        console.log("Error in fetching data: ", error);
        toast({
            title: "Failed to fetch published blogs",
            variant: 'destructive',
            description: error?.message,
        });
    }
}

export async function deletePublishedBlog(slug) {

    try {
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
    catch (error) {
        console.log("Error in deleting data: ", error);
        toast({
            title: "Failed to delete blog",
            variant: 'destructive',
            description: error?.message,
        });
    }
}

export async function unPublishThePublishedBlog(id) {

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
    catch (err) {
        console.log(err);
        toast({
            title: "Failed to unpublish blog",
            variant: 'destructive',
            description: err?.message,
        });
    }
}