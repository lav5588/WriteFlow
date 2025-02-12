// src/app/api/u/[username]/route.ts

import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import PostModel, { Post } from '@/models/post.model';
import { ISessionUser } from '@/types/user';
import { NextResponse } from 'next/server';


export async function GET(req: Request, context: { params: { slug: string | null } }) {
    await dbConnect();
    try {
        const { slug } = (await context).params;

        if (!slug || slug === "") {
            return NextResponse.json({ messsage: "slug is required" }, { status: 400 });
        }
        const session = await auth();
        if (!session || !session.user || !session.user._id) {
            return NextResponse.json({ "message": "unauthorised user" }, { status: 400 })
        }
        const user:ISessionUser = session.user;

        const post:Post | null = await PostModel.findOne({ slug: slug, author: user._id });

        if (!post) {
            return NextResponse.json({ message: `${slug} not found` }, { status: 400 });
        }
        return NextResponse.json(post, { status: 200 });
    } catch (error:unknown) {
        return NextResponse.json({ message: "Not able to fetch User", error: error }, { status: 200 });
    }

}


