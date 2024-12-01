import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";




export async function GET(request: Request) {
    // Connect to the database
    await dbConnect();
    console.log("hello")
    try {
        const session = await auth();

        if (!session) {
            const response: ApiResponse = {
                status: 401,
                success: false,
                message: "Unauthorized",
            }
            return Response.json(response, { status: 401 });
        }
        const user = session.user;
        
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        
        if(!id){
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: "Id is required",
            }
            return Response.json(response, { status: 400 });
        }

        const post = await PostModel.findById(id);
        if(!post){
            const response: ApiResponse = {
                status: 404,
                success: false,
                message: "Post not found",
            }
            return Response.json(response, { status: 404 });
        }
        post.isPublished = !post.isPublished;
        await post.save();

        const response: ApiResponse = {
            status: 200,
            success: true,
            message: "Post published successfully",
            data: post,
        }
        return Response.json(response, { status: 200 });

        
    } catch (error) {
        console.log(error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error publishing post",
            error: error?.message,
        }
        return Response.json(response, { status: 500 });
    }

}