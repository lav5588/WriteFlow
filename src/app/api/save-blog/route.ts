import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";

import { boolean } from "zod";


export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();
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
        console.log("user: ", user);
        const { title, content, isPublished, slug } = await request.json();

        if (!title || !content || !slug) {
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: "All fields are required",
            }
            return Response.json(response, { status: 400 });
        }


        // Create a new blog post
        console.log(`Creating new blog post`);
        const newPost = await PostModel.create({
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
    } catch (error) {
        console.log(error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error creating post",
            error: error?.message,
        }
        return Response.json(response, { status: 500 });
    }

}