import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .refine(
            (val) => {
                const forbidden = ['todo', 'in progress', 'done'];
                return !forbidden.includes(val.trim().toLowerCase());
            },
            {
                message: 'Title cannot be "Todo", "In Progress", or "Done".',
            }
        ),
    description: z.string().optional(),
    assignedUser: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'), // MongoDB ObjectId
    status: z.enum(['Todo', 'In Progress', 'Done']),
    priority: z.enum(['Low', 'Medium', 'High']),
    updatedAt: z.string().optional()
});


export const updateTaskSchema = createTaskSchema.partial();
