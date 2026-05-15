import { z } from 'zod'

export const contactSchema = z.object({
  name:    z.string().trim().min(1, 'This field is required.').max(100, 'Max 100 characters.'),
  email:   z.string().trim().min(1, 'This field is required.').email('Please enter a valid email address.').max(254, 'Max 254 characters.'),
  subject: z.string().trim()
    .min(1, 'This field is required.')
    .max(200, 'Max 200 characters.')
    .refine((v) => !/[\r\n]/.test(v), 'Subject cannot contain line breaks.'),
  message: z.string().trim().min(10, 'This field is required.').max(5000, 'Max 5000 characters.'),
})

export type ContactInput = z.infer<typeof contactSchema>
