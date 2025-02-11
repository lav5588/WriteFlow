import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import PostModel, { Post } from '@/models/post.model';
import { User } from '@/models/user.model';
import { HydratedDocument } from 'mongoose';

import { NextRequest, NextResponse } from 'next/server';

export interface IPopulatedPost extends Omit<Post, 'author'> {
    author: User;
}

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        const slug = (await params).slug
        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }
        // const blog = await PostModel.findOne({ slug}).populate('author');
        const blog: HydratedDocument<IPopulatedPost> | null = await PostModel
            .findOne({ slug })
            .populate<{ author: User }>('author')

        if (blog && blog.isPublished === true) {
            return NextResponse.json(blog, { status: 200 });
        }
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        if(blog && blog.author._id  == session.user._id){
            return NextResponse.json(blog, { status: 200 });
        }
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
