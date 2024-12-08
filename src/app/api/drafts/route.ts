import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ "message": "unauthorised user" }, { status: 400 })
        }
        const user = session.user;
        const unPublishedBlogs = await PostModel.find({ author: user._id, isPublished: false });

        if (!unPublishedBlogs) {
            return NextResponse.json({ "message": "Something went wrong in finding the draft" }, { status: 200 })
        }

        if (unPublishedBlogs.length == 0) {
            return NextResponse.json({ "message": "You have not any draft" }, { status: 404 })
        }

        return NextResponse.json(unPublishedBlogs , { status: 200 })
    }
    catch (error) {
        console.error("Error fetching drafts:", error);
        return NextResponse.json({ "message": "Internal Server Error" }, { status: 200 })
    }
}