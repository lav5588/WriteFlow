import axios from "axios";
import { z } from "zod";


export const slugValidation = z
    .string()
    .min(5, 'slug must be at least 5 characters')
    .refine(async (slug) => {
        try {
            const response = await axios.get(`/api/check-slug-unique?slug=${slug}`);
            console.log("response: ", response);

            return response.data.success;
        } catch (error) {
            console.log("Error checking slug: ", error);
            return false;  // Consider returning false if the API call fails
        }
    }, {
        message: 'slug is already taken',
    });

export const blogSchema = z.object({
    title: z.string().min(5, 'title should be atleast 5 characters'),
    content: z.string(),
    slug: slugValidation,
    isPublished: z.boolean(),
})


