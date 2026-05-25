import Link from 'next/link'
import { cacheLife } from 'next/cache'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export default async function ImportPage() {
  'use cache'
  cacheLife('max')

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <header className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">Import guide</p>
        <h1 className="mt-2">Getting your Lambretta to Australia</h1>
        <p className="mt-6 text-lg text-[#f2f2ee] leading-relaxed">
          We build in Spain and ship to Australia. The process involves import clearance, a road-worthy inspection, and historic registration before the bike reaches you. We coordinate every step from Madrid to your door, so you are not dealing with customs forms or government offices.
        </p>
      </header>

      <section className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">Step 01</p>
        <h2 className="mt-2">Pre-1989 historic exemption</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          Every Lambre-Bull is built on a pre-1989 chassis, which qualifies the bike for the historic vehicle exemption from Australian Design Rules. This exemption means the bike is not required to meet current ADR compliance standards for a new vehicle registration. It is the same legal pathway used for classic cars and vintage motorcycles brought into Australia. You do not need to apply for the exemption yourself. We build specifically to this specification, so the qualification is built in from the start.
        </p>
      </section>

      <section className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">Step 02</p>
        <h2 className="mt-2">Import and customs</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          The bike is crafted in Madrid and shipped by sea to an Australian port. Import duty and customs clearance are handled on arrival by our import agent. You are not required to lodge any paperwork with Australian Border Force or any other agency. We manage the broker, the duty payment, and the port release. Once the crate clears customs, we arrange delivery to the inspection site for the next step.
        </p>
      </section>

      <section className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">Step 03</p>
        <h2 className="mt-2">Blue Slip inspection</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          Before the bike can be registered in New South Wales, it must pass an Authorised Unregistered Vehicle Inspection, commonly called a Blue Slip. The inspection confirms the vehicle is roadworthy and legally identifiable. We arrange the inspection with an approved station once the bike arrives in Sydney. If any minor items need attention, we sort them before the bike goes to registration. The buyer does not need to be present for the inspection.
        </p>
      </section>

      <section className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">Step 04</p>
        <h2 className="mt-2">Historic registration</h2>
        <p className="mt-4 text-[#f2f2ee] leading-relaxed">
          Once the Blue Slip is issued, we lodge the registration application with Service NSW under the historic vehicle category. This category is available for pre-1989 vehicles and comes with the characteristic yellow plates recognised by the classic vehicle community. Road use has some conditions attached, which we walk you through before handover. Registration is completed before delivery, so the bike arrives with plates and can be ridden from day one.
        </p>
      </section>

      <section className="mb-12">
        <h2>Common questions</h2>
        <Accordion className="mt-6">
          <AccordionItem value="faq-1">
            <AccordionTrigger>Do I need to handle import duty myself?</AccordionTrigger>
            <AccordionContent>
              No. Customs and import duty are handled by our import agent on arrival in Australia. You do not need to contact any government agency or lodge any paperwork. The cost is included in the delivered price we quote.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>How long does the whole process take?</AccordionTrigger>
            <AccordionContent>
              From the point the build is complete to delivery in Sydney, the process typically takes a few months end to end. Sea freight alone accounts for the bulk of that time. We keep you updated at each stage so you know where the bike is.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>What do I need to do during the import?</AccordionTrigger>
            <AccordionContent>
              Very little. We handle the freight, customs clearance, the road-worthy check, and registration on your behalf. The main thing we need from you is confirmation of the delivery address and your NSW licence details for the registration paperwork.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4">
            <AccordionTrigger>Will the bike be road-legal in my state?</AccordionTrigger>
            <AccordionContent>
              The bike is registered through Service NSW under the historic vehicle category, which covers road use in New South Wales. If you are in another state, we can discuss the transfer process. Historic vehicle registration requirements vary by state, and we will work through the details with you before the build is confirmed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-5">
            <AccordionTrigger>What about parts and servicing after delivery?</AccordionTrigger>
            <AccordionContent>
              We connect buyers with Australian Lambretta specialists who know the GP and series Lambrettas. Parts for these bikes are also well supported by established UK suppliers who ship to Australia. You will not be on your own once the bike is with you.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="border-t border-[rgba(242,242,238,0.12)] pt-12 mt-12 flex flex-col gap-4">
        <h2>Still have questions?</h2>
        <p className="text-[#f2f2ee] leading-relaxed">
          We are happy to walk through the process in detail before you commit to anything.
        </p>
        <Link
          href={`/contact?subject=${encodeURIComponent('Inquiry: Import and registration')}`}
          className="self-start inline-flex items-center justify-center bg-[#cc2200] hover:bg-[#a81c00] text-[#f2f2ee] uppercase tracking-widest font-black px-6 py-3 rounded-sm transition-colors min-h-[44px]"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          Get in touch
        </Link>
        <p className="text-xs text-[#888880]">We reply within 2 business days.</p>
      </section>
    </article>
  )
}
