import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const emailResponse = await resend.emails.send({
            from: `dev@${process.env.VERIFIED_DOMAIN_ON_RESEND}`,
            to: email,
            subject: 'Write Flow Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        if (!emailResponse.data) {
            return { status: 500, success: false, message: 'Failed to send verification email.' };
        }
        return { status: 200, success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { status: 405, success: false, message: 'Failed to send verification email.' };
    }
}
