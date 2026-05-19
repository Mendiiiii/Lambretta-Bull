import Link from 'next/link'
import { MobileMenu } from '@/components/mobile-menu'

const links = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },
  { href: '/about', label: 'About' },
  { href: '/import', label: 'How it gets to you' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-10 h-16 bg-[#0a0a0a] border-b border-[rgba(242,242,238,0.12)] flex items-center px-4 md:px-8">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-[#f2f2ee] hover:text-[#cc2200] transition-colors"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          LAMBRE-BULL
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm uppercase tracking-widest text-[#f2f2ee] hover:text-[#cc2200] transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <MobileMenu />
      </div>
    </header>
  )
}
