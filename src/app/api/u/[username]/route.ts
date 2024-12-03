// src/app/api/u/[username]/route.ts

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { NextResponse } from 'next/server';


export async function GET(req: Request, {params}: { params: Promise<{ username: string ;}> }) {
    await dbConnect();
    try {
        const username = (await params).username;

        if (!username) {
            return NextResponse.json({ messsage: "username is required" }, { status: 200 });
        }

        const user = await UserModel.findOne({ username: username})
        if(!user) {
            return NextResponse.json({ message: `${username} not found` }, { status: 200 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Not able to fetch User",error:error }, { status: 200 });
    }




}


