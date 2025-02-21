import dbConnect from '@/lib/dbConnect';
import UserModel, { User } from '@/models/user.model';
import { z } from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import { auth } from '@/auth';


export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        const session = await auth();

        if(session?.user?.username == username){
            const response: ApiResponse = {
                status: 200,
                success: true,
                message: 'User is authenticated',
            }
            return Response.json(response);
        }

        const existingVerifiedUser:User | null = await UserModel.findOne({
            username,
            isVerified: true,
        });


        if (existingVerifiedUser) {
            const response: ApiResponse = {
                status: 200,
                success: false,
                message: 'Username is already taken',
            }
            return Response.json(response);
        }
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: 'Username is unique',
        }
        return Response.json(response);

    } catch (error:unknown) {
        console.error('Error checking username:', error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: 'Error checking username',
        }
        return Response.json(response);
    }
}
