import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";


export async function GET(request: Request){
    await dbConnect();
    try{
        const blogs = await PostModel.find({isPublished:true}).populate('author');
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
    
    }catch (e) {
        console.error("Error fetching blogs:", e);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error fetching blogs",
            error: e?.message,
        }
        return Response.json(response,{status: 500});
    }
}