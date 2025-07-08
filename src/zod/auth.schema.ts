import z from 'zod';

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const registerSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(
            passwordRegex,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(
            passwordRegex,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ),
});