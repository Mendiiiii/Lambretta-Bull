'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  submitContact,
  type ContactFormState,
} from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const initialState: ContactFormState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[#cc2200] hover:bg-[#a81c00] text-[#f2f2ee] uppercase tracking-widest font-black px-6 py-3 rounded-sm transition-colors min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ fontFamily: 'var(--font-barlow-condensed)' }}
    >
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  )
}

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, formAction] = useActionState(submitContact, initialState)
  const errors = state.errors ?? {}

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Name</Label>
        <Input
          id="contact-name"
          name="name"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
        />
        {errors.name && (
          <p id="contact-name-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.email[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Subject</Label>
        <Input
          id="contact-subject"
          name="subject"
          required
          defaultValue={defaultSubject ?? ''}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
        />
        {errors.subject && (
          <p id="contact-subject-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.subject[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
        />
        {errors.message && (
          <p id="contact-message-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.message[0]}</p>
        )}
      </div>

      <SubmitButton />

      <div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem]">
        {state.status === 'success' && state.message && (
          <p className="text-sm text-[#f2f2ee]">{state.message}</p>
        )}
        {state.status === 'error' && state.message && (
          <p className="text-sm text-[oklch(0.65_0.22_27)]">{state.message}</p>
        )}
      </div>
    </form>
  )
}
