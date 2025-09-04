import { z } from 'zod';

// Signup form validation schema
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  confirm_password: z
    .string(),
  
  sex: z
    .string()
    .min(1, 'Please select your gender'),
  
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 13 && num <= 120;
    }, 'Age must be between 13 and 120'),
  
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

// Type inference for TypeScript
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
