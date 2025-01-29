import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function uploadOnCloudinary(file: File): Promise<string> {
    try {
        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");
        const dataUri = `data:${file.type};base64,${base64Image}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
            resource_type: "auto",
        });

        return uploadResponse.secure_url; // Return public URL
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload to Cloudinary");
    }
}



export async function deleteFromCloudinary(imageUrl: string): Promise<boolean> {
    try {
        // Extract public ID from the URL
        const publicId = extractPublicId(imageUrl);

        if (!publicId) {
            throw new Error("Invalid Cloudinary URL");
        }

        // Delete image from Cloudinary
        const deleteResponse = await cloudinary.uploader.destroy(publicId);

        return deleteResponse.result === "ok";
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
        return false;
    }
}


function extractPublicId(url: string): string {
    try {
        const matches = url.match(/\/upload\/(?:v\d+\/)?([^/.]+)\./);
        return matches ? matches[1] : "";
    } catch (error) {
        console.error("Error extracting public ID:", error);
        return "";
    }
}