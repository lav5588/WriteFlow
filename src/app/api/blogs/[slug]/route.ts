// src/app/api/blogs/[slug]/route.ts

import dbConnect from '@/lib/dbConnect';
import PostModel from '@/models/post.model';
import { NextResponse } from 'next/server';


export async function GET(req: Request, context: { params: { slug: string } }) {
    await dbConnect();
    try {
        const { slug } = await context.params;

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const blogs = await PostModel.findOne({ slug: slug})
        if(!blogs) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }




}


