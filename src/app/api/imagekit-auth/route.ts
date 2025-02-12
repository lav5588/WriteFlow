import ImageKit from "imagekit"
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET(request:NextRequest) {
    return NextResponse.json(imagekit.getAuthenticationParameters());
}