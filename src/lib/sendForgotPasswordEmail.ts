import { resend } from "@/lib/resend";
import { ApiResponse } from '@/types/ApiResponse';
import ForgotPasswordEmail from "../../emails/forgotPasswordEmail";

export async function sendForgotPasswordEmail(
    email: string,
    username: string,
    resetLink: string
): Promise<ApiResponse> {
    try {
        const emailResponse = await resend.emails.send({
            from: `dev@${process.env.VERIFIED_DOMAIN_ON_RESEND}`,
            to: email,
            subject: 'Write Flow reset password link',
            react: ForgotPasswordEmail({ username, resetLink}),
        });
        if (!emailResponse.data) {
            return { status: 500, success: false, message: 'Failed to send forgot password email.' };
        }
        return { status: 200, success: true, message: 'forgot password email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending forgot password email:', emailError);
        return { status: 405, success: false, message: 'Failed to send forgot password email.' };
    }
}
