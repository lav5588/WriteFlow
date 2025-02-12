'use client'
import React from "react";
import { ImageKitProvider } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;


// if (!urlEndpoint || !publicKey) {
//     console.log("urlEndPoint: ", urlEndpoint)
//     console.log("publicKey: ", publicKey)
//     throw new Error("Missing IMAGEKIT_URL_ENDPOINT or IMAGEKIT_PUBLIC_KEY environment variables.");
// }

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit-auth");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : ''}`);
    }
};

export default function ImageKitProviderWrapper({ children }: { children: React.ReactNode }) {
    return (

        <ImageKitProvider urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
            {children}
        </ImageKitProvider>
    );
}