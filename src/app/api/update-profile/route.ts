import { auth } from "@/auth";
import { deleteFromCloudinary, uploadOnCloudinary } from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";


export async function PUT(request: Request): Promise<Response> {
    await dbConnect();
    try {

        const session = await auth();
        if (!session) {
            return Response.json({ message: "unauthenticated request" }, { status: 400 });
        }
        const sessionUser = session.user;
        const user = await UserModel.findOne({ username: sessionUser.username });
        if (!user) {
            return Response.json({ message: "user not found" }, { status: 404 });
        }
        const data = await request.formData();
        const profileImage = data.get("profileImage");
        if (profileImage) {
            const profileImageUrl = await uploadOnCloudinary(profileImage as File);
            if (!profileImageUrl) {
                return Response.json({ message: "Failed to upload profile image" }, { status: 500 });
            }
            const oldProfileImageUrl = user.profileImage;
            user.profileImage = profileImageUrl;
            if (oldProfileImageUrl) {
                await deleteFromCloudinary(oldProfileImageUrl);
            }
        }
    
        await user.save();
    
        console.log("session: ", session);
    
        return Response.json({ session, user }, { status: 200 });
    } catch (error) {
        console.log("error: ", error);
        return Response.json({error},{status: 500});
    }
}
