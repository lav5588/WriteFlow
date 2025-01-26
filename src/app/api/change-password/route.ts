import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/post.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();
    try {
        const session = await auth();
        if (!session || !session.user) {
            const response: ApiResponse = {
                status: 401,
                success: false,
                message: "Unauthorized",
            }
            return Response.json(response, { status: 401 });
        }
        const username = session.user.username;
        const { oldPassword, newPassword, confirmNewPassword } = await request.json();
        if(!oldPassword || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: "All fields are required",
            }
            return Response.json(response, { status: 400 });
        }  
        const user = await UserModel.findOne({ username });
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if(!isOldPasswordCorrect) {
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: "Old password is incorrect",
            }
            return Response.json(response, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: "Password changed successfully",
        }
        return Response.json(response, { status: 200 });
        
    } catch (error) {
        console.log(error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: "Error in changing  password",
            error: error?.message,
        }
        return Response.json(response, { status: 500 });
    }

}