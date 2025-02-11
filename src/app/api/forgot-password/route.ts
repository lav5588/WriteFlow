import dbConnect from "@/lib/dbConnect";
import { sendForgotPasswordEmail } from "@/lib/sendForgotPasswordEmail";
import UserModel, { User } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { console } from "inspector";


export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const identifier = searchParams.get('identifier');
        
        const user: User | null = await UserModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier },
            ],
        });

        if (!user) {
            const response: ApiResponse = {
                status: 500,
                success: false,
                message: "User not found",
            }
            return Response.json(response, { status: 500 });
        }
        
        const token:string = uuidv4();
        const expiration: Date = new Date();
        expiration.setHours(expiration.getHours() + 1);

        user.resetAndForgotPasswordToken = token;
        user.resetAndForgotPasswordTokenExpiry = expiration;
        await user.save();
        const resetLink = `${request.headers.get('referer')}/${token}`;
        console.log(resetLink);
        const emailResponse = await sendForgotPasswordEmail(user.email, user.username,resetLink);
        return Response.json({ message: 'Email sent' },{status:200});
    } catch (error:unknown) {
        console.log("catch part: ",error);
        return Response.json({ message: 'Error sending email' }, { status: 500 });
    }
}


export async function POST(request:Request){
    try {
        await dbConnect();

        const urlArr:string[] | undefined =request.headers.get('referer')?.split('/');

        if(!urlArr || urlArr.length === 0){
            return Response.json({ message: 'Invalid url' }, { status: 400 });
        }
        const token = urlArr[urlArr.length - 1];
        const { newPassword, confirmPassword }:{ newPassword:string, confirmPassword:string } = await request.json();

        if(newPassword !== confirmPassword){
            return Response.json({ message: 'Passwords do not match' }, { status: 400 });
        }

        const user:User | null = await UserModel.findOne({
            $and: [
                { resetAndForgotPasswordToken: token },
                { resetAndForgotPasswordTokenExpiry: { $gt: new Date() } },
            ],
        });

        if(!user){
            return Response.json({ message: 'Invalid token' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetAndForgotPasswordToken = '';
        await user.save();
        return Response.json({ message: 'Email sent',user },{status:200});

    } catch (error) {
        return Response.json({ message: 'Error sending email',error:error instanceof Error?error.message: '' }, { status: 500 });
    }
}