import { describe, it, expect } from 'vitest'
import {
  ConfigOption,
  ConfiguratorOptions,
  ConfigSelections,
  configuratorOptions,
  getOptionLabel,
} from '../configurator'

describe('configuratorOptions data', () => {
  it('has exactly 4 categories: chassis, motor, discos, sourcing', () => {
    const keys = Object.keys(configuratorOptions)
    expect(keys).toContain('chassis')
    expect(keys).toContain('motor')
    expect(keys).toContain('discos')
    expect(keys).toContain('sourcing')
  })

  it('each category has 2 or more options', () => {
    expect(configuratorOptions.chassis.length).toBeGreaterThanOrEqual(2)
    expect(configuratorOptions.motor.length).toBeGreaterThanOrEqual(2)
    expect(configuratorOptions.discos.length).toBeGreaterThanOrEqual(2)
    expect(configuratorOptions.sourcing.length).toBeGreaterThanOrEqual(2)
  })

  it('chassis includes a 1966-tv200 option', () => {
    const option = configuratorOptions.chassis.find((o) => o.id === '1966-tv200')
    expect(option).toBeDefined()
    expect(option?.label).toBe('1966 TV 200')
  })

  it('sourcing includes both handbuilt and england-sourced options', () => {
    const ids = configuratorOptions.sourcing.map((o) => o.id)
    expect(ids).toContain('handbuilt')
    expect(ids).toContain('england-sourced')
  })

  it('each option has id, label, and description fields', () => {
    const allOptions = [
      ...configuratorOptions.chassis,
      ...configuratorOptions.motor,
      ...configuratorOptions.discos,
      ...configuratorOptions.sourcing,
    ]
    for (const option of allOptions) {
      expect(typeof option.id).toBe('string')
      expect(typeof option.label).toBe('string')
      expect(typeof option.description).toBe('string')
    }
  })
})

describe('getOptionLabel', () => {
  it('returns the label for a known option id', () => {
    const label = getOptionLabel('chassis', '1966-tv200')
    expect(label).toBe('1966 TV 200')
  })

  it('returns the id itself when the option is not found', () => {
    const label = getOptionLabel('chassis', 'nonexistent-id')
    expect(label).toBe('nonexistent-id')
  })
})
