'use server'

import { Resend } from 'resend'
import { configSchema } from '@/lib/validations'
import { getOptionLabel } from '@/lib/configurator'
import type { ConfigSelections } from '@/lib/configurator'

const RESEND_FROM = 'Lambre-Bull <onboarding@resend.dev>'

export type ConfigFormState = {
  status: 'idle' | 'success' | 'error'
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
    chassis?: string[]
    motor?: string[]
    discos?: string[]
    sourcing?: string[]
  }
  message?: string
}

export async function submitInquiry(
  selections: ConfigSelections,    // from .bind(null, selections) -- FIRST param
  _prevState: ConfigFormState,     // from useActionState -- SECOND param
  formData: FormData,              // from form submission -- THIRD param
): Promise<ConfigFormState> {
  const parsed = configSchema.safeParse({
    ...selections,                            // chassis, motor, discos, sourcing (null values will fail required validation)
    name: formData.get('name'),
    email: formData.get('email'),
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
    console.error('[configure-action] RESEND_API_KEY missing')
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or email us directly.',
    }
  }

  const to = process.env.RESEND_TO_EMAIL
  if (!to) {
    console.error('[configure-action] RESEND_TO_EMAIL missing')
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or email us directly.',
    }
  }

  const chassisLabel = getOptionLabel('chassis', parsed.data.chassis)

  const emailText = [
    `Custom Build Inquiry from ${parsed.data.name}`,
    '',
    `Chassis:  ${chassisLabel}`,
    `Motor:    ${getOptionLabel('motor', parsed.data.motor)}`,
    `Discos:   ${getOptionLabel('discos', parsed.data.discos)}`,
    `Sourcing: ${getOptionLabel('sourcing', parsed.data.sourcing)}`,
    '',
    `Message: ${parsed.data.message ?? '(none)'}`,
    '',
    `Contact: ${parsed.data.name} <${parsed.data.email}>`,
  ].join('\n')

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: [to],
      replyTo: parsed.data.email,
      subject: `Custom Build Inquiry: ${chassisLabel}`,
      text: emailText,
    })
    return {
      status: 'success',
      message: "Inquiry sent. We'll be in touch shortly.",
    }
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unknown error'
    console.error('[configure-action]', messageText)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or email us directly.',
    }
  }
}
