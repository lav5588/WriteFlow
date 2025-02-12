import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import { ApiResponse } from "@/types/ApiResponse";
import { IPopulatedPost } from "./[slug]/route";
import { User } from "@/models/user.model";
import { NextRequest } from "next/server";
import { number } from "zod";


export async function GET(request: NextRequest){
    await dbConnect();
    try{
        const searchParams = request.nextUrl.searchParams
        let pageNo:number = Number(searchParams.get('pageno')) || 1;
        const pageSize = Number(searchParams.get('pagesize')) || 8;
        // const blogs:IPopulatedPost[] = await PostModel.find({isPublished:true}).skip(pageSize*(pageNo-1)).limit(pageSize).populate<{ author: User }>('author');
        const [totalBlogs, blogs] = await Promise.all([
            PostModel.countDocuments({ isPublished: true }), // Get total count
            PostModel.find({ isPublished: true })
                .skip(pageSize * (pageNo - 1))
                .limit(pageSize)
                .populate<{ author: User }>("author")
        ]);
        console.log("totalBlogs :",totalBlogs)
        if(!blogs){
            const response:ApiResponse = {
                status: 500,
                success: false,
                message: "Error fetching blogs",
            }
            return Response.json(response,{status: 500});
        }
        if(blogs.length == 0){
            const response:ApiResponse = {
                status: 200,
                success: true,
                message: "No blogs found",
            }
            return Response.json(response,{status: 200});
        }
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: "Blogs fetched successfully",
        }
        return Response.json({response,totalBlogs:totalBlogs,data: blogs,},{status: 200});
    
    }catch (e:unknown) {
        console.error("Error fetching blogs:", e);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error fetching blogs",
            error: e instanceof Error ? e.message:'',
        }
        return Response.json(response,{status: 500});
    }
}