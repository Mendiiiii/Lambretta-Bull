export function PriceAnchor({ priceAUD }: { priceAUD: number }) {
  if (priceAUD <= 0) {
    return (
      <p
        className="text-[#cc2200] uppercase tracking-widest text-2xl font-black"
        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
      >
        Price TBA
      </p>
    )
  }
  const formatted = priceAUD.toLocaleString('en-AU')
  return (
    <p
      className="text-[#cc2200] uppercase tracking-widest text-2xl font-black"
      style={{ fontFamily: 'var(--font-barlow-condensed)' }}
    >
      from AU${formatted}
    </p>
  )
}
