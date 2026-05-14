import type { BikeSpec } from '@/lib/bikes'

const sourcingLabel: Record<BikeSpec['partsSourcing'], string> = {
  handbuilt: 'Handbuilt in workshop',
  'england-sourced': 'Sourced from England',
  mixed: 'Mixed, handbuilt and sourced',
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-[rgba(242,242,238,0.12)] last:border-b-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888880]">{label}</p>
      <p
        className="text-xl text-[#f2f2ee] font-black mt-1"
        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
      >
        {value}
      </p>
    </div>
  )
}

export function SpecSheet({ spec }: { spec: BikeSpec }) {
  return (
    <section aria-labelledby="spec-heading" className="bg-[#1a1a1a] rounded-sm p-6">
      <h2 id="spec-heading" className="mb-4">Specifications</h2>
      <Row label="Chassis" value={`${spec.chassis.year} ${spec.chassis.model}`} />
      <Row label="Engine" value={spec.engine} />
      <Row label="Discs" value={spec.discs} />
      <Row label="Parts sourcing" value={sourcingLabel[spec.partsSourcing]} />
      <Row
        label="Handmade components"
        value={
          spec.handmadeComponents.length === 0
            ? 'None'
            : spec.handmadeComponents.join(', ')
        }
      />
    </section>
  )
}
