'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

const links = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden text-sm font-semibold uppercase tracking-widest text-[#f2f2ee] hover:text-[#cc2200] transition-colors min-h-[44px] px-2"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        Menu
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-[#f2f2ee] hover:text-[#cc2200] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X size={28} aria-hidden="true" />
          </button>
          <ul className="flex flex-col items-center gap-8">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-5xl font-black tracking-tight text-[#f2f2ee] hover:text-[#cc2200] transition-colors"
                  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
