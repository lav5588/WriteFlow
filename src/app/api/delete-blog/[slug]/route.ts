import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel, { Post } from "@/models/post.model";

export async function DELETE(request: Request,
    { params }: { params: Promise<{ slug: string | null }> }){
    await dbConnect();

    try {
        const slug = (await params).slug
        const session = await auth();
        if(!session || !session.user || !session.user._id){
            return Response.json({ message:"Unauthorized user"},{status: 401})
        }
        if(!slug || slug === ""){
            return Response.json({ message:"slug is required for deleting the blog"},{status: 400})
        }
        const post:Post | null = await PostModel.findOneAndDelete({ slug, author: session.user._id });
        if(!post){
            return Response.json({ message:"either post not found or you are not allowed to delete this post"},{status: 400});
        }
        return Response.json({ message:"post successfully deleted"},{status: 200});
    }
    catch (error:unknown) {
        console.log("error: ",error);
        return Response.json({ message:"Error in deleting post", error});
    }
}