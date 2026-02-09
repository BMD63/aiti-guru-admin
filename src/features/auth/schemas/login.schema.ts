import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
