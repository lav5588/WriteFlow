'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { veryfyCodeSchema } from "@/schemas/verifyCodeSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"


const page = () => {

    const params = useParams();
    const router = useRouter()

    const form = useForm<z.infer<typeof veryfyCodeSchema>>({
        resolver: zodResolver(veryfyCodeSchema),
        defaultValues: {
            verifyCode: '',
        }
    });

    //TODO:
    const onSubmit = async(values: z.infer<typeof veryfyCodeSchema>) => {
        // TODO: do the network call
        const data = {username:params.username,code:values.verifyCode}
        console.log(data);
        try {
            const response = await axios.post('/api/verify-code',data);
            console.log(response);
            router.push('/sign-in')
        } catch (error) {
            console.log("user verification error",error);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center">
            <h1>Enter OTP</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="verifyCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" >Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default page