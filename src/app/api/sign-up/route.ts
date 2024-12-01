import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function POST(request: Request) {
  await dbConnect();
  console.log("Hi");
  try {
    const { username, email, password } = await request.json();
     if (!username ||!email ||!password) {
      const response:ApiResponse = {
        status: 400,
        success: false,
        message: 'All fields are required',
      }
      return Response.json(response);
    }

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
        const response:ApiResponse = {
            status: 400,
            success: false,
            message: 'User already exists with this username',
            }
        return Response.json(response);
    }
    

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        const response:ApiResponse = {
            status: 400,
            success: false,
            message: 'User already exists with this email',
            }
        return Response.json(response);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.emailVerificationCode = verifyCode;
        existingUserByEmail.emailVerificationCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        emailVerificationCode: verifyCode,
        emailVerificationCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      const response:ApiResponse = {
        status: 500,
        success: false,
        message:  emailResponse.message,
      }
      return Response.json(response);
    }

    const response:ApiResponse = {
        status: 201,
        success: true,
        message:  'User registered successfully. Please verify your account.',
    }
    return Response.json(response);

  } catch (error:any) {
    console.error('Error registering user:', error);
    const resaponse:ApiResponse ={
        status: 500,
        success: false,
        message: 'Error registering user',
        error: error.message,
  
    }
    return Response.json(resaponse);
  }
}
