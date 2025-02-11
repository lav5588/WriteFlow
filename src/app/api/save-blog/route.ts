import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel, { Post } from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";
import { ISessionUser } from "@/types/user";
import mongoose from "mongoose";



export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();
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
        console.log("user: ", user);
        const { title, content, isPublished, slug }:{ title:string, content:string, isPublished:boolean, slug:string } = await request.json();

        if (!title.trim() || !content.trim() || !slug.trim()) {
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: "All fields are required",
            }
            return Response.json(response, { status: 400 });
        }

        const existingPostBySlug:Post | null = await PostModel.findOne({ slug});
        if (existingPostBySlug) {
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: "Slug is not unique",
            }
            return Response.json(response, { status: 400 });
        }

        // Create a new blog post
        console.log(`Creating new blog post`);
        const newPost:Post | null = await PostModel.create({
            title,
            content,
            isPublished: Boolean(isPublished),
            slug,
            author: new  mongoose.Types.ObjectId(user._id),
        });
        console.log(`Created new blog post`);

        if (!newPost) {
            const response: ApiResponse = {
                status: 500,
                success: false,
                message: "Failed to create post",
            }
            return Response.json(response, { status: 500 });
        }
        const response: ApiResponse = {
            status: 201,
            success: true,
            message: "Post created successfully",
            data: newPost,
        }
        return Response.json(response, { status: 201 });
    } catch (error:unknown) {
        console.log(error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error creating post",
            error: error instanceof Error? error.message:'', 
        }
        return Response.json(response, { status: 500 });
    }
}