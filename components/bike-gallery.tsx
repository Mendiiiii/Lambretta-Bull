'use client'

import { useState } from 'react'
import Image from 'next/image'

type Photo = { src: string; alt: string }

export function BikeGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0)
  if (photos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-[#1a1a1a] flex items-center justify-center text-[#888880]">
        Photos coming soon
      </div>
    )
  }
  const current = photos[active]
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className="object-cover"
          priority={active === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {photos.length > 1 && (
        <ul className="grid grid-cols-4 gap-2">
          {photos.map((photo, i) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo: ${photo.alt}`}
                aria-current={i === active ? 'true' : undefined}
                className={`relative aspect-square w-full overflow-hidden rounded-sm transition-opacity ${
                  i === active
                    ? 'opacity-100 ring-2 ring-[#cc2200]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
