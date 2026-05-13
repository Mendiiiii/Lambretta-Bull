export function CheckerboardStripe({ height = 8 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: `${height}px`,
        backgroundImage:
          'repeating-conic-gradient(#1a1a1a 0% 25%, #f2f2ee 0% 50%) 0 0 / 16px 16px',
      }}
    />
  )
}
