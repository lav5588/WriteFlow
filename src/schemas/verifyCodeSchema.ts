import { z } from "zod";


export const veryfyCodeSchema =z.object({
    verifyCode: z.string().length(6,'O`tp must contain exactly 6 digit(s)').regex(/^\d+$/,'only digits are allowed')
});