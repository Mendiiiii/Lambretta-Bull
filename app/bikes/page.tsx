import Image from 'next/image'
import { cacheLife } from 'next/cache'
import { galleryBikes } from '@/lib/gallery'

export default async function BikesPage() {
  'use cache'
  cacheLife('max')

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <header className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">The builds</p>
        <h1 className="mt-2">Artefactory Bikes</h1>
        <p className="mt-4 max-w-2xl text-[#f2f2ee] text-lg">
          A selection of builds from the Artefactory workshop. Each one is a one-off. These are examples of the work, not inventory.
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {galleryBikes.map((bike) => (
          <li key={bike.id}>
            <div className="bg-[#1a1a1a] border border-[rgba(242,242,238,0.12)] rounded-sm overflow-hidden">
              <div className="aspect-[4/3] bg-[#0a0a0a] relative overflow-hidden">
                <Image
                  src={bike.photo.src}
                  alt={bike.photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888880]">{bike.year}</p>
                <h2 className="mt-1 text-3xl">{bike.name}</h2>
                <p className="mt-2 text-[#888880]">{bike.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
