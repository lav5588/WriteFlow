import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel, { Post } from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";
import { ISessionUser } from "@/types/user";





export async function GET(request: Request) {
    // Connect to the database
    await dbConnect();
    console.log("hello")
    try {
        const session = await auth();

        if (!session || !session.user || !session.user._id) {
            const response: ApiResponse = {
                status: 401,
                success: false,
                message: "Unauthorized",
            }
            return Response.json(response, { status: 401 });
        }
        const user:ISessionUser = session.user;
        
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

        const post:Post| null = await PostModel.findById(id);
        if(!post){
            const response: ApiResponse = {
                status: 404,
                success: false,
                message: "Post not found",
            }
            return Response.json(response, { status: 404 });
        }
        if(post.author.toString() !== user._id.toString()){
            const response: ApiResponse = {
                status: 403,
                success: false,
                message: "Unauthorized to publish post",
            }
            return Response.json(response, { status: 403 });
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

        
    } catch (error:unknown) {
        console.log(error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error publishing post",
            error: error instanceof Error ?error.message:'',
        }
        return Response.json(response, { status: 500 });
    }

}