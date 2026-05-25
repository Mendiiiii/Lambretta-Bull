import Link from 'next/link'
import Image from 'next/image'
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
      <section className="mb-12">
        <h1 className="text-5xl md:text-6xl">Handcrafted Lambrettas, Spain to Australia.</h1>
        <p className="mt-4 max-w-2xl text-[#f2f2ee] text-lg leading-snug">
          One-of-one builds from the Artefactory workshop in Madrid.<br />
          Browse current bikes or get in touch about a custom build.
        </p>
      </section>

      {getAvailableBikes().length === 0 ? (
        <p className="text-[#888880]">
          No bikes available right now. New builds are underway, get in touch to be first to know.
        </p>
      ) : (
        <ul className="flex flex-col items-center gap-8">
          {getAvailableBikes().map((bike) => (
            <li key={bike.id} className="w-full md:w-[85%] lg:w-[70%]">
              <Link
                href={`/bikes/${bike.id}`}
                className="block group bg-[#1a1a1a] border border-[rgba(242,242,238,0.12)] rounded-sm overflow-hidden hover:border-[#cc2200] transition-colors"
              >
                <div className="aspect-[16/9] bg-[#0a0a0a] relative overflow-hidden">
                  {bike.photos[0] ? (
                    <Image
                      src={bike.photos[0].src}
                      alt={bike.photos[0].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 85vw, 70vw"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[#888880] text-sm">Photo coming soon</span>
                  )}
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
