import dbConnect from "@/lib/dbConnect";
import PostModel, { Post } from "@/models/post.model";
import UserModel, { User } from "@/models/user.model";


export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        if(!username){
            return Response.json({  message:"missing parameter username" },{ status:400});
        }
        const user:User | null = await UserModel.findOne({ username: username});
        if(!user){
            return Response.json({  message:"User not found" },{ status:404});
        }
        const post:Post[] = await PostModel.find({ isPublished:true ,author:user._id});
        if(!post){
            return Response.json({  message:"Post not found" },{ status:404});
        }
        return Response.json({  post, status:200, message:"Post fetched successfully"},{ status:200});
    } catch (error:unknown) {
        console.error("Error fetching post: ", error);
        return Response.json({  message:"Error fetching post", error: error instanceof Error? error.message:'' },{ status:500});
    }
}