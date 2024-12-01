import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { ApiResponse } from '@/types/ApiResponse'

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const id = searchParams.get('id');
        const result = await PostModel.findOne({ slug });
        if (result && result._id != id) {
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: 'slug is not unique',
            }

            return Response.json(response, { status: 400 })
        }
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: 'slug is unique'
        }

        return Response.json(response, { status: 200});

    }catch (err) {
        console.error('Error fetching post:', err);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: 'Error fetching post',
            error: err,
        }
        return Response.json(response, { status: 500 });
    }
}