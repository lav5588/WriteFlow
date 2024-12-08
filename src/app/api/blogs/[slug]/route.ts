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

        const blog = await PostModel.findOne({ slug, isPublished: true });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
