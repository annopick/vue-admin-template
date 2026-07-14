import { describe, it, expect } from 'vitest'
import { parseTime, formatTime, param2Obj } from '@/utils'

// Migrated from the legacy Jest specs (parseTime.spec.js, formatTime.spec.js,
// param2Obj.spec.js). Assertions are identical — syntax port from Jest to Vitest.

describe('Utils: parseTime', () => {
  it('parses a timestamp with default format', () => {
    const time = new Date(2024, 0, 15, 14, 32, 8) // Jan 15 2024 14:32:08
    expect(parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')).toBe('2024-01-15 14:32:08')
  })

  it('parses with custom format', () => {
    const time = new Date(2024, 0, 15)
    expect(parseTime(time, '{y}/{m}/{d}')).toBe('2024/01/15')
  })

  it('returns null for invalid input', () => {
    expect(parseTime(null as unknown as Date)).toBe(null)
    expect(parseTime('not-a-date' as unknown as number)).toBe(null)
  })
})

describe('Utils: formatTime', () => {
  it('formats recent time as just now', () => {
    const now = Date.now()
    expect(formatTime(now)).toBe('刚刚')
  })

  it('formats sub-30s as 刚刚, 30s+ as minutes', () => {
    // formatTime has no "seconds" bucket: <30s = 刚刚, then 分钟/小时/天.
    expect(formatTime(Date.now() - 10 * 1000)).toBe('刚刚')
    // 90s → ceil(90/60) = 2 分钟前
    expect(formatTime(Date.now() - 90 * 1000)).toContain('分钟')
  })

  it('formats minutes ago', () => {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000
    expect(formatTime(fiveMinAgo)).toContain('分钟')
  })

  it('formats hours ago', () => {
    const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000
    expect(formatTime(threeHoursAgo)).toContain('小时')
  })

  it('formats days ago', () => {
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000
    expect(formatTime(twoDaysAgo)).toContain('天')
  })
})

describe('Utils: param2Obj', () => {
  it('parses a query string into an object', () => {
    expect(param2Obj('?a=1&b=2&c=3')).toEqual({ a: '1', b: '2', c: '3' })
  })

  it('handles URL-encoded values', () => {
    expect(param2Obj('?name=%E5%BC%A0%E4%B8%89&age=25')).toEqual({
      name: '张三',
      age: '25',
    })
  })

  it('returns empty object for empty or no-? string', () => {
    expect(param2Obj('')).toEqual({})
    expect(param2Obj('no-question-mark')).toEqual({})
  })
})
