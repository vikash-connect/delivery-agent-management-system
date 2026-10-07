import { z } from 'zod';

export const createAgentSchema = z.object({
  fullName: z
    .string({ message: 'fullName is required' })
    .trim()
    .min(2, 'fullName must be at least 2 characters'),
  phoneNumber: z
    .string({ message: 'phoneNumber is required' })
    .trim()
    .min(7, 'phoneNumber must be at least 7 characters'),
  email: z
    .string({ message: 'email is required' })
    .trim()
    .email('Invalid email format'),
  serviceArea: z
    .string({ message: 'serviceArea is required' })
    .trim()
    .min(1, 'serviceArea cannot be empty'),
  status: z
    .enum(['ACTIVE', 'INACTIVE'], {
      message: 'status must be ACTIVE or INACTIVE',
    })
    .default('ACTIVE'),
});

export const updateAgentSchema = z
  .object({
    fullName: z.string().trim().min(2, 'fullName must be at least 2 characters').optional(),
    phoneNumber: z.string().trim().min(7, 'phoneNumber must be at least 7 characters').optional(),
    email: z.string().trim().email('Invalid email format').optional(),
    serviceArea: z.string().trim().min(1, 'serviceArea cannot be empty').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE'], {
      message: 'status must be ACTIVE or INACTIVE',
    }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const queryAgentSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  serviceArea: z.string().optional(),
  search: z.string().optional(),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
export type QueryAgentInput = z.infer<typeof queryAgentSchema>;
