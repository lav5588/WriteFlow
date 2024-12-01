import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "./lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt"


class InvalidLoginError extends CredentialsSignin {
    code = "Invalid identifier or password"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                identifier: { label: "Username or email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });
                    console.log("user: ",user);
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }
                    console.log("credentials: ",credentials);
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    console.log("isPasswordCorrect: ",isPasswordCorrect);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new InvalidLoginError();
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(); // Convert ObjectId to string
                token.role = user.role;
                token.isVerified = user.isVerified;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.role = token.role;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
            }
            return session;
        },
    },

})