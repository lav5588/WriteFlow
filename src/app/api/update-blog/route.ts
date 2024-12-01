import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";

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
            };
            return Response.json(response, { status: 401 });
        }

        const user = session.user;
        const { title, content, isPublished, slug, id } = await request.json();

        if (!title || !content || !slug) {
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: "All fields are required",
            };
            return Response.json(response, { status: 400 });
        }

        console.log("Finding blog post...");
        // Use `findOne` to get a single document
        const post = await PostModel.findOne({
            _id: new mongoose.Types.ObjectId(id),
            author: new mongoose.Types.ObjectId(user._id),
        });

        if (!post) {
            const response: ApiResponse = {
                status: 404,
                success: false,
                message: "Post not found",
            };
            return Response.json(response, { status: 404 });
        }

        // Update the document fields
        post.title = title;
        post.content = content;
        post.isPublished = isPublished;
        post.slug = slug;

        // Save the updated document
        await post.save();

        const response: ApiResponse = {
            status: 200,
            success: true,
            message: "Post updated successfully",
            data: post,
        };
        return Response.json(response, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error updating post",
            error: error?.message,
        };
        return Response.json(response, { status: 500 });
    }
}
