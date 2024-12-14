import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import PostModel from '@/models/post.model';
import { NextResponse } from 'next/server';



export async function GET(request: Request,
    { params }: { params: Promise<{ slug: string }> }){
    await dbConnect();

    try {

        const slug = (await params).slug 

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const blog = await PostModel.findOne({ slug, isPublished: true }).populate('author');

        if(blog){
            return NextResponse.json(blog, { status: 200 });
        }

        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        const userBlog = await PostModel.findOne({ slug, author: session.user._id }).populate('author');

        if (!userBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(userBlog, { status: 200 });

        
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
