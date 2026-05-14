import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'This field is required.'),
  email: z
    .string()
    .trim()
    .min(1, 'This field is required.')
    .email('Please enter a valid email address.'),
  subject: z.string().trim().min(1, 'This field is required.'),
  message: z.string().trim().min(10, 'This field is required.'),
})

export type ContactInput = z.infer<typeof contactSchema>
