import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { ApiResponse } from '@/types/ApiResponse';

export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            const response: ApiResponse = {
                status: 404,
                success: false,
                message: 'User not found'
            }
            return Response.json(response, { status: 404});
        }

        // Check if the code is correct and not expired
        const isCodeValid = user.emailVerificationCode === code;
        const isCodeNotExpired = new Date(user.emailVerificationCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            // Update the user's verification status
            user.isVerified = true;
            user.emailVerificationCode = '';
            await user.save();

            const response: ApiResponse = {
                status: 200,
                success: true,
                message: 'Account verified successfully'
            }
            return Response.json(response,{status:200});

        } else if (!isCodeNotExpired) {
            // Code has expired
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: 'Verification code has expired. Please sign up again to get a new code.',
            }
            return Response.json(response,{status:400});

        } else {
            // Code is incorrect
            const response: ApiResponse = {
                status: 400,
                success: false,
                message: 'Incorrect verification code',
            }
            return Response.json(response,{status:400});

        }
    } catch (error) {
        console.error('Error verifying user:', error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: 'Error verifying user',
            error: error,
        }
        return Response.json(response,{status:500});
    }
}
