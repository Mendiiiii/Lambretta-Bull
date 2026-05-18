'use client'

import { useState, useRef, useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { submitInquiry, type ConfigFormState } from '@/app/actions/configure'
import type { ConfiguratorOptions, ConfigSelections } from '@/lib/configurator'
import { getOptionLabel } from '@/lib/configurator'

const TOTAL_STEPS = 5

const STEP_NAMES: Record<number, string> = {
  1: 'CHASSIS',
  2: 'MOTOR',
  3: 'DISCOS',
  4: 'SOURCING',
  5: 'CONTACT + SUMMARY',
}

const STEP_CATEGORIES: Record<number, keyof ConfiguratorOptions> = {
  1: 'chassis',
  2: 'motor',
  3: 'discos',
  4: 'sourcing',
}

const STEP_HEADINGS: Record<number, string> = {
  1: 'CHOOSE YOUR CHASSIS',
  2: 'CHOOSE YOUR MOTOR',
  3: 'CHOOSE YOUR DISCOS',
  4: 'CHOOSE YOUR SOURCING',
  5: 'REVIEW AND SUBMIT',
}

const initialSelections: ConfigSelections = {
  chassis: null,
  motor: null,
  discos: null,
  sourcing: null,
}

const initialState: ConfigFormState = { status: 'idle' }

// CRITICAL: SubmitButton must be a separate function component — not inline in the form.
// useFormStatus() reads from the nearest ancestor <form> context.
// If it is in the same component that renders <form>, it always returns { pending: false }.
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[#cc2200] hover:bg-[#a81c00] text-[#f2f2ee] uppercase tracking-widest font-black px-6 py-3 rounded-sm transition-colors min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ fontFamily: 'var(--font-barlow-condensed)' }}
    >
      {pending ? 'SENDING...' : 'SUBMIT INQUIRY'}
    </Button>
  )
}

export function ConfiguratorWizard({ options }: { options: ConfiguratorOptions }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState<ConfigSelections>(initialSelections)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const successRef = useRef<HTMLHeadingElement>(null)

  // .bind() called INSIDE component body — captures current selections on every render
  const boundAction = submitInquiry.bind(null, selections)
  const [state, formAction] = useActionState(boundAction, initialState)

  // Focus management: move focus to success heading on success
  useEffect(() => {
    if (state.status === 'success') {
      successRef.current?.focus()
    }
  }, [state.status])

  function goToStep(step: number) {
    setDirection(step > currentStep ? 'forward' : 'backward')
    setCurrentStep(step)
    // NEVER reset selections here — free navigation (D-03) only changes current step
  }

  function handleNext() {
    setDirection('forward')
    setCurrentStep((s) => s + 1)
  }

  function handleBack() {
    setDirection('backward')
    setCurrentStep((s) => s - 1)
  }

  const errors = state.errors ?? {}
  const animationClass = direction === 'forward'
    ? 'animate-in fade-in-0 slide-in-from-right-4 duration-150'
    : 'animate-in fade-in-0 slide-in-from-left-4 duration-150'

  // SUCCESS STATE: replaces entire wizard
  if (state.status === 'success') {
    return (
      <div className="animate-in fade-in-0 duration-300">
        <h2
          ref={successRef}
          tabIndex={-1}
          className="text-3xl font-black tracking-tight uppercase text-[#f2f2ee]"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          INQUIRY SENT
        </h2>
        <p className="mt-2 text-base text-[#888880] leading-normal">
          We&apos;ve received your custom build inquiry and will be in touch shortly.
        </p>
        {/* Read-only configuration summary — same Zone A format, no CHANGE links */}
        <div className="mt-6 bg-[#1a1a1a] rounded-sm border border-[rgba(242,242,238,0.12)] p-6 flex flex-col gap-4">
          {(['chassis', 'motor', 'discos', 'sourcing'] as const).map((cat, i) => (
            <div key={cat}>
              {i > 0 && <Separator className="mb-4 bg-[rgba(242,242,238,0.12)]" />}
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-widest text-[#888880]">{cat}</span>
                <span
                  className="text-base font-black uppercase text-[#f2f2ee]"
                  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                >
                  {selections[cat] ? getOptionLabel(cat, selections[cat]!) : '—'}
                </span>
              </div>
            </div>
          ))}
          <Separator className="bg-[rgba(242,242,238,0.12)]" />
          <p className="text-sm text-[#888880]">AU$18,000 – AU$25,000</p>
        </div>
        <a
          href="/"
          className="mt-8 inline-block text-sm font-black uppercase tracking-widest text-[#cc2200] hover:text-[#a81c00] transition-colors"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          ← Back to Bikes
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Progress indicator */}
      <nav aria-label="Configurator progress" className="mb-6">
        <p
          className="text-sm font-black uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          <span className="text-[#888880]">STEP {currentStep} OF {TOTAL_STEPS} — </span>
          <span className="text-[#cc2200]">{STEP_NAMES[currentStep]}</span>
        </p>
      </nav>

      {/* Step content — key drives animation on every step change */}
      <div key={`step-${currentStep}-${direction}`} className={animationClass}>
        <h2
          className="text-3xl font-black tracking-tight uppercase text-[#f2f2ee] mb-8"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          {STEP_HEADINGS[currentStep]}
        </h2>

        {/* Steps 1-4: option card grid */}
        {currentStep <= 4 && (() => {
          const category = STEP_CATEGORIES[currentStep]
          const categoryOptions = options[category]
          const currentSelection = selections[category]

          return (
            <div
              role="radiogroup"
              aria-label={`Choose your ${category}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {categoryOptions.map((option) => {
                const isSelected = currentSelection === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select ${category}: ${option.label}`}
                    onClick={() => setSelections((prev) => ({ ...prev, [category]: option.id }))}
                    className={cn(
                      'text-left p-4 rounded-sm min-h-[80px] transition-all duration-150',
                      isSelected
                        ? 'bg-[#1a1a1a] ring-2 ring-[#cc2200]'
                        : 'bg-[#1a1a1a] ring-1 ring-[rgba(242,242,238,0.12)] hover:bg-[#2a2a2a] hover:ring-[rgba(242,242,238,0.20)]'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className="text-base font-black uppercase text-[#f2f2ee] leading-snug"
                        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check size={16} className="text-[#cc2200] flex-shrink-0 ml-2" aria-hidden="true" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-[#888880] leading-normal">{option.description}</p>
                  </button>
                )
              })}
            </div>
          )
        })()}

        {/* Step 5: Summary (Zone A) + Contact form (Zone B) */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-8">
            {/* Zone A — Configuration summary */}
            <div>
              <h3
                className="text-3xl font-black uppercase text-[#f2f2ee] mb-4"
                style={{ fontFamily: 'var(--font-barlow-condensed)' }}
              >
                YOUR BUILD
              </h3>
              <div className="bg-[#1a1a1a] rounded-sm border border-[rgba(242,242,238,0.12)] p-6 flex flex-col gap-4">
                {(['chassis', 'motor', 'discos', 'sourcing'] as const).map((cat, i) => {
                  const stepForCat = (['chassis', 'motor', 'discos', 'sourcing'] as const).indexOf(cat) + 1
                  return (
                    <div key={cat}>
                      {i > 0 && <Separator className="mb-4 bg-[rgba(242,242,238,0.12)]" />}
                      <div className="flex justify-between items-center">
                        <span className="text-sm uppercase tracking-widest text-[#888880]">{cat}</span>
                        <div className="flex items-center gap-4">
                          <span
                            className="text-base font-black uppercase text-[#f2f2ee]"
                            style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                          >
                            {selections[cat] ? getOptionLabel(cat, selections[cat]!) : '—'}
                          </span>
                          <button
                            type="button"
                            onClick={() => goToStep(stepForCat)}
                            className="text-sm uppercase tracking-widest text-[#cc2200] hover:text-[#a81c00] transition-colors"
                            style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                          >
                            CHANGE
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <Separator className="bg-[rgba(242,242,238,0.12)]" />
                <p className="text-sm text-[#888880]">AU$18,000 – AU$25,000</p>
              </div>
            </div>

            {/* Zone B — Contact form */}
            <div>
              <h3
                className="text-3xl font-black uppercase text-[#f2f2ee] mb-6"
                style={{ fontFamily: 'var(--font-barlow-condensed)' }}
              >
                YOUR DETAILS
              </h3>
              <form action={formAction} className="flex flex-col gap-6" noValidate>
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cfg-name" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Name</Label>
                  <Input
                    id="cfg-name"
                    name="name"
                    required
                    maxLength={100}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'cfg-name-error' : undefined}
                    className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
                  />
                  {errors.name && (
                    <p id="cfg-name-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.name[0]}</p>
                  )}
                </div>
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cfg-email" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Email</Label>
                  <Input
                    id="cfg-email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'cfg-email-error' : undefined}
                    className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
                  />
                  {errors.email && (
                    <p id="cfg-email-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.email[0]}</p>
                  )}
                </div>
                {/* Message — optional */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cfg-message" className="text-xs uppercase tracking-widest text-[#f2f2ee]">
                    Message <span className="text-[#888880] normal-case tracking-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="cfg-message"
                    name="message"
                    rows={4}
                    maxLength={2000}
                    placeholder="Any additional details or questions"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'cfg-message-error' : undefined}
                    className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200] placeholder:text-[#888880]"
                  />
                  {errors.message && (
                    <p id="cfg-message-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.message[0]}</p>
                  )}
                </div>

                <SubmitButton />

                <div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem]">
                  {state.status === 'error' && state.message && (
                    <p className="text-sm text-[oklch(0.65_0.22_27)]">{state.message}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {/* Mobile: fixed bottom, stacked. Desktop: static, side by side. */}
      <div className="mt-8 md:mt-12">
        {/* Desktop nav */}
        <div className="hidden md:flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-black uppercase tracking-widest text-[#888880] hover:text-[#cc2200] transition-colors min-h-[44px] px-4"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          {currentStep < 5 && (() => {
            const category = STEP_CATEGORIES[currentStep]
            const isDisabled = selections[category] === null
            return (
              <button
                type="button"
                onClick={isDisabled ? undefined : handleNext}
                aria-disabled={isDisabled}
                className={cn(
                  'text-sm font-black uppercase tracking-widest text-[#f2f2ee] bg-[#cc2200] hover:bg-[#a81c00] transition-colors min-h-[44px] min-w-[200px] px-6 rounded-sm',
                  isDisabled && 'opacity-40 cursor-not-allowed hover:bg-[#cc2200]'
                )}
                style={{ fontFamily: 'var(--font-barlow-condensed)' }}
              >
                NEXT: {STEP_NAMES[currentStep + 1]} →
              </button>
            )
          })()}
        </div>
        {/* Mobile: fixed bottom sticky nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[rgba(242,242,238,0.12)] p-4 flex flex-col gap-2 z-10">
          {currentStep < 5 && (() => {
            const category = STEP_CATEGORIES[currentStep]
            const isDisabled = selections[category] === null
            return (
              <button
                type="button"
                onClick={isDisabled ? undefined : handleNext}
                aria-disabled={isDisabled}
                className={cn(
                  'w-full text-sm font-black uppercase tracking-widest text-[#f2f2ee] bg-[#cc2200] hover:bg-[#a81c00] transition-colors min-h-[44px] px-6 rounded-sm',
                  isDisabled && 'opacity-40 cursor-not-allowed hover:bg-[#cc2200]'
                )}
                style={{ fontFamily: 'var(--font-barlow-condensed)' }}
              >
                NEXT: {STEP_NAMES[currentStep + 1]} →
              </button>
            )
          })()}
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="w-full text-sm font-black uppercase tracking-widest text-[#888880] hover:text-[#cc2200] transition-colors min-h-[44px] px-4"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              ← Back
            </button>
          )}
        </div>
        {/* Bottom padding so content is not hidden behind mobile sticky nav */}
        <div className="h-32 md:hidden" aria-hidden="true" />
      </div>

      {/* No-selection guard — shown below nav on steps 1-4 when nothing selected */}
      {currentStep < 5 && selections[STEP_CATEGORIES[currentStep]] === null && (
        <p className="mt-2 text-sm text-[#888880] text-center md:text-right">
          Select an option to continue
        </p>
      )}
    </div>
  )
}
