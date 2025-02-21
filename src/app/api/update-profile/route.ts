import { auth } from "@/auth";
import { deleteFromCloudinary, uploadOnCloudinary } from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/user.model";


export async function PUT(request: Request): Promise<Response> {
    await dbConnect();
    try {

        const session = await auth();
        if (!session || !session.user || !session.user) {
            return Response.json({ message: "unauthenticated request" }, { status: 400 });
        }
        const sessionUser = session.user;
        const user:User | null = await UserModel.findOne({ username: sessionUser.username });
        if (!user) {
            return Response.json({ message: "user not found" }, { status: 404 });
        }

        const data = await request.formData();
        const profileImage = data.get("profileImage");
        const name:string = data.get("name") as string;
        const username:string = data.get("username") as string;
        const bio:string = data.get("bio") as string;

        if (profileImage) {
            const profileImageUrl:string = await uploadOnCloudinary(profileImage as File);
            if (!profileImageUrl || profileImageUrl === "") {
                return Response.json({ message: "Failed to upload profile image" }, { status: 500 });
            }
            const oldProfileImageUrl = user.profileImage;
            user.profileImage = profileImageUrl;
            if (oldProfileImageUrl) {
                await deleteFromCloudinary(oldProfileImageUrl);
            }
            session.user.profileImage = profileImageUrl;
        }

        if(typeof bio === "string" && bio.trim()!= "") {
            user.bio = bio;
        }

        if(typeof name === "string" && name.trim() != "") {
            user.name = name.trim();
        }

        if(typeof username === "string" && username.trim()!= "") {
            user.username = username.trim();
        }

        
        const res = await user.save();
    
    
        return Response.json({res, session, user,name,username,bio:user.bio}, { status: 200 });
    } catch (error:unknown) {
        console.log("error: ", error);
        return Response.json({error},{status: 500});
    }
}
