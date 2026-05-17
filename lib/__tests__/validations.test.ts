import { describe, it, expect } from 'vitest'
import { contactSchema, configSchema } from '../validations'

describe('contactSchema (existing — must remain unchanged)', () => {
  it('accepts a valid contact payload', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a message longer than ten chars',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = contactSchema.safeParse({
      name: '',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a message longer than ten chars',
    })
    expect(result.success).toBe(false)
  })
})

describe('configSchema', () => {
  const validPayload = {
    name: 'John',
    email: 'john@example.com',
    chassis: '1966-tv200',
    motor: 'handbuilt-200cc',
    discos: 'front-disc-drum-rear',
    sourcing: 'handbuilt',
  }

  it('accepts a valid configurator payload without message', () => {
    const result = configSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('accepts a valid payload with optional message', () => {
    const result = configSchema.safeParse({
      ...validPayload,
      message: 'I would like a red one please.',
    })
    expect(result.success).toBe(true)
  })

  it('message is optional (can be absent)', () => {
    const { message: _, ...withoutMessage } = { ...validPayload, message: undefined }
    const result = configSchema.safeParse(withoutMessage)
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = configSchema.safeParse({ ...validPayload, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = configSchema.safeParse({ ...validPayload, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects missing chassis', () => {
    const result = configSchema.safeParse({ ...validPayload, chassis: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing motor', () => {
    const result = configSchema.safeParse({ ...validPayload, motor: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing discos', () => {
    const result = configSchema.safeParse({ ...validPayload, discos: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing sourcing', () => {
    const result = configSchema.safeParse({ ...validPayload, sourcing: '' })
    expect(result.success).toBe(false)
  })

  it('message max 2000 chars is enforced', () => {
    const result = configSchema.safeParse({
      ...validPayload,
      message: 'a'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })
})
