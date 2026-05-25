import Link from 'next/link'
import { cacheLife } from 'next/cache'
import { BuildVideo } from '@/components/build-video'

export default async function AboutPage() {
  'use cache'
  cacheLife('max')

  const videoUrl: string | undefined = undefined // set to a YouTube or Vimeo embed URL to activate the build process video

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <header className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">The craftsman</p>
        <h1 className="mt-2">Bulbena builds them. We bring them to Australia.</h1>
        <p className="mt-6 text-lg text-[#f2f2ee] leading-relaxed">
          Lambre-Bull is the working name of a partnership between a Spanish workshop and an Australian seller. The bikes are built one at a time by Bulbena in Spain. The bridge to Australia is what we do.
        </p>
      </header>

      <section className="mb-12">
        <h2>The maker</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          Bulbena has been restoring and rebuilding Lambrettas in Spain for years. The shop builds in single-figure batches, each bike spending weeks on the bench. There is no production line. Frames are stripped to bare metal, every part is inspected, replaced, or remade by hand.
        </p>
      </section>

      <section className="mb-12">
        <h2>The workshop</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          The workshop is Artefactory, Alfonso Bulbena's studio in Madrid. It is a small space, exactly the size you need to build one bike well, not the size you would use to ship volume. Tools are organised by job, not by category. The lights stay on past sunset most days of the week.
        </p>
      </section>

      <section className="mb-12">
        <h2>The build</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          Each Lambretta starts with a period-correct chassis, usually pre-1989 to qualify for Australian historic registration. The engine is rebuilt, the discs are matched to the chassis, the side panels and seat are made in-house. Parts that cannot be made well are sourced from established UK suppliers. The bike is finished, tested on the road, then disassembled for transit.
        </p>
      </section>

      <section className="mb-12">
        <h2>The journey to Sydney</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          From Madrid the bike is crated and shipped by sea to an Australian port. Customs and import duty are handled on arrival. The bike clears the road-worthy and historic registration process in New South Wales, then it is delivered to the buyer in Sydney. The whole crossing takes a few months end to end.
        </p>
        <p className="mt-4 text-[#888880] text-sm">
          Full regulatory detail on the import and registration pathway is published in a separate guide later in the rollout.
        </p>
      </section>

      {videoUrl && (
        <section className="mb-12">
          <BuildVideo src={videoUrl} />
        </section>
      )}

      <section className="border-t border-[rgba(242,242,238,0.12)] pt-12 mt-12 flex flex-col gap-4">
        <h2>Want a build of your own?</h2>
        <p className="text-[#f2f2ee] leading-relaxed">
          We do not build to order in volume. Each conversation is a real one. Tell us what you have in mind, we will write back.
        </p>
        <Link
          href={`/contact?subject=${encodeURIComponent('Inquiry: Custom Build')}`}
          className="self-start inline-flex items-center justify-center bg-[#cc2200] hover:bg-[#a81c00] text-[#f2f2ee] uppercase tracking-widest font-black px-6 py-3 rounded-sm transition-colors min-h-[44px]"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          Ask About a Build
        </Link>
        <p className="text-xs text-[#888880]">We reply within 2 business days.</p>
      </section>
    </article>
  )
}
