import { describe, it, expect } from 'vitest'
import { isExternal, validUsername } from '@/utils/validate'

// Migrated from the legacy Jest spec (tests/unit/utils/validate.spec.js).
// Assertions are identical — this is a syntax port from Jest to Vitest.

describe('Utils: validate', () => {
  it('isExternal: identifies external URLs', () => {
    expect(isExternal('https://github.com')).toBe(true)
    expect(isExternal('http://example.com')).toBe(true)
    expect(isExternal('mailto:a@b.com')).toBe(true)
    expect(isExternal('tel:+1234')).toBe(true)
    expect(isExternal('/dashboard')).toBe(false)
    expect(isExternal('dashboard')).toBe(false)
    expect(isExternal('')).toBe(false)
  })

  it('validUsername: accepts 4-20 alphanumeric/underscore', () => {
    expect(validUsername('admin')).toBe(true)
    expect(validUsername('user_123')).toBe(true)
    expect(validUsername('abc')).toBe(false) // too short
    expect(validUsername('a'.repeat(21))).toBe(false) // too long
    expect(validUsername('user-name')).toBe(false) // hyphen not allowed
  })
})
