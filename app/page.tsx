import Link from 'next/link'
import { cacheLife } from 'next/cache'
import { getAvailableBikes } from '@/lib/bikes'

function formatPrice(priceAUD: number): string {
  if (priceAUD <= 0) return 'Price TBA'
  return `from AU$${priceAUD.toLocaleString('en-AU')}`
}

export default async function HomePage() {
  'use cache'
  cacheLife('max')

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <section className="mb-16">
        <h1 className="text-5xl md:text-6xl">Handcrafted Lambrettas, Spain to Australia.</h1>
        <p className="mt-4 max-w-2xl text-[#f2f2ee] text-lg">
          One-of-one builds from the Artefactory workshop in Madrid.
        </p>
        <p className="max-w-2xl text-[#f2f2ee] text-lg">
          Browse current bikes or get in touch about a custom build.
        </p>
      </section>

      {getAvailableBikes().length === 0 ? (
        <p className="text-[#888880]">
          No bikes available right now. New builds are underway, get in touch to be first to know.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {getAvailableBikes().map((bike) => (
            <li key={bike.id}>
              <Link
                href={`/bikes/${bike.id}`}
                className="block group bg-[#1a1a1a] border border-[rgba(242,242,238,0.12)] rounded-sm overflow-hidden hover:border-[#cc2200] transition-colors"
              >
                <div className="aspect-[4/3] bg-[#0a0a0a] flex items-center justify-center text-[#888880] text-sm">
                  {bike.photos[0]?.alt ?? 'Photo coming soon'}
                </div>
                <div className="p-6">
                  <h2 className="text-3xl">{bike.name}</h2>
                  <p className="text-[#888880] mt-2">{bike.tagline}</p>
                  <p className="mt-4 text-[#cc2200] uppercase tracking-widest text-xl font-black" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                    {formatPrice(bike.priceAUD)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
