import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel, { Post } from "@/models/post.model";
import { ISessionUser } from "@/types/user";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await auth();
        if (!session || !session.user || !session.user._id) {
            return NextResponse.json({ "message": "unauthorised user" }, { status: 400 })
        }
        const user:ISessionUser = session.user;
        const unPublishedBlogs:Post[] | null = await PostModel.find({ author: user._id, isPublished: false });

        if (!unPublishedBlogs) {
            return NextResponse.json({ "message": "Draft not found" }, { status: 404 })
        }
        if(unPublishedBlogs.length == 0){
            return NextResponse.json({ "message": "No drafts found" }, { status: 200 }) 
        }

        return NextResponse.json(unPublishedBlogs , { status: 200 })
    }
    catch (error:unknown) {
        console.error("Error fetching drafts:", error);
        return NextResponse.json({ "message": "Internal Server Error" }, { status: 200 })
    }
}