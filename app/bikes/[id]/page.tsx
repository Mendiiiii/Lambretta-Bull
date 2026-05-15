import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cacheLife } from 'next/cache'
import { getAvailableBikes, getBike } from '@/lib/bikes'
import { BikeGallery } from '@/components/bike-gallery'
import { SpecSheet } from '@/components/spec-sheet'
import { PriceAnchor } from '@/components/price-anchor'

export async function generateStaticParams() {
  return getAvailableBikes().map((b) => ({ id: b.id }))
}

export default async function BikePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  'use cache'
  cacheLife('max')

  const { id } = await params
  const bike = getBike(id)
  if (!bike || !bike.available) notFound()

  const inquiryHref = `/contact?subject=${encodeURIComponent(`Inquiry: ${bike.name}`)}`

  return (
    <article className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link href="/" className="text-[#888880] hover:text-[#f2f2ee] uppercase tracking-widest">
          Back to bikes
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <BikeGallery photos={bike.photos} />
        </div>
        <div className="flex flex-col gap-6">
          <header>
            <h1>{bike.name}</h1>
            <p className="text-[#888880] mt-2">{bike.tagline}</p>
          </header>

          <PriceAnchor priceAUD={bike.priceAUD} />

          <SpecSheet spec={bike.spec} />

          <Link
            href={inquiryHref}
            className="inline-flex items-center justify-center bg-[#cc2200] hover:bg-[#a81c00] text-[#f2f2ee] uppercase tracking-widest font-black px-6 py-3 rounded-sm transition-colors min-h-[44px]"
            style={{ fontFamily: 'var(--font-barlow-condensed)' }}
          >
            Inquire About This Bike
          </Link>

          <p className="text-xs text-[#888880]">
            We reply within 2 business days. Australian buyers, Spanish workshop, one direct conversation.
          </p>
        </div>
      </div>
    </article>
  )
}
