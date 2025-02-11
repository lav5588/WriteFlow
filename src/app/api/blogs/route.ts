import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";
import { IPopulatedPost } from "./[slug]/route";
import { User } from "@/models/user.model";


export async function GET(request: Request){
    await dbConnect();
    try{
        const blogs:IPopulatedPost[] = await PostModel.find({isPublished:true}).populate<{ author: User }>('author');
        if(!blogs){
            const response:ApiResponse = {
                status: 500,
                success: false,
                message: "Error fetching blogs",
            }
            return Response.json(response,{status: 500});
        }
        if(blogs.length == 0){
            const response:ApiResponse = {
                status: 200,
                success: true,
                message: "No blogs found",
            }
            return Response.json(response,{status: 200});
        }
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
        }
        return Response.json(response,{status: 200});
    
    }catch (e:unknown) {
        console.error("Error fetching blogs:", e);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error fetching blogs",
            error: e instanceof Error ? e.message:'',
        }
        return Response.json(response,{status: 500});
    }
}