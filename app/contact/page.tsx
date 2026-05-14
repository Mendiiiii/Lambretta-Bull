import { Suspense } from 'react'
import { connection } from 'next/server'
import { ContactForm } from '@/components/contact-form'

async function ContactContent({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  await connection()
  const { subject } = await searchParams
  return (
    <>
      <header className="mb-8">
        <h1>Get in touch.</h1>
        <p className="mt-2 text-[#888880]">
          One direct conversation between you and the seller. We reply within 2 business days.
        </p>
      </header>
      <ContactForm defaultSubject={subject} />
    </>
  )
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  return (
    <main className="max-w-lg mx-auto px-4 py-16">
      <Suspense fallback={null}>
        <ContactContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
