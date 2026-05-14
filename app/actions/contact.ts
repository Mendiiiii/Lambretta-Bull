'use server'

import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations'

const RESEND_FROM = 'Lambre-Bull <onboarding@resend.dev>'
const RESEND_TO_DEFAULT = 'imendifp@gmail.com'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  errors?: {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
  }
  message?: string
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact-action] RESEND_API_KEY missing')
    return {
      status: 'error',
      message:
        'Something went wrong. Try again or email us directly at imendifp@gmail.com.',
    }
  }

  const resend = new Resend(apiKey)
  const to = process.env.RESEND_TO_EMAIL ?? RESEND_TO_DEFAULT

  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: [to],
      replyTo: parsed.data.email,
      subject: parsed.data.subject,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    })
    return {
      status: 'success',
      message: "Message sent. We'll be in touch within 2 business days.",
    }
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unknown error'
    console.error('[contact-action]', messageText)
    return {
      status: 'error',
      message:
        'Something went wrong. Try again or email us directly at imendifp@gmail.com.',
    }
  }
}
