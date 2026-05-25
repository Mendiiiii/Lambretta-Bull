import { Suspense } from 'react'
import { ConfiguratorWizard } from '@/components/configurator-wizard'
import { configuratorOptions } from '@/lib/configurator'

function ConfigureContent() {
  return (
    <>
      <header className="mb-10">
        <h1 className="uppercase">BUILD YOUR LAMBRE-BULL</h1>
        <p className="mt-2 text-sm text-[#888880]">
          Specify your chassis, engine, and components. We build it by hand in Madrid.
        </p>
        <p className="mt-1 text-sm text-[#888880]">from AU$18,000 to AU$25,000</p>
      </header>
      <ConfiguratorWizard options={configuratorOptions} />
    </>
  )
}

export default function ConfigurePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-16">
      <Suspense fallback={null}>
        <ConfigureContent />
      </Suspense>
    </main>
  )
}
