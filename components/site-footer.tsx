export function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0a] text-[#f2f2ee] py-12 px-4 md:px-8 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col gap-2">
        <p className="font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>Lambre-Bull</p>
        <p className="text-[#888880]">Handcrafted in Spain. Shipped to Australia.</p>
        <p className="text-[#888880] text-xs mt-4">&copy; 2026 Lambre-Bull. All rights reserved.</p>
      </div>
    </footer>
  )
}
