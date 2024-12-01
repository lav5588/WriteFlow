import axios from 'axios';
import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')
  .refine(async (username) => {
    try {
      const response = await axios.get(`/api/check-username-unique?username=${username}`);
      console.log("response: ", response);

      return response.data.success;
    } catch (error) {
      console.error("Error checking username: ", error);
      return false;  // Consider returning false if the API call fails
    }
  }, {
    message: 'Username is already taken',
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(20, { message: 'Password must be at most 20 characters'}),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'], // error will appear at confirmPassword
});