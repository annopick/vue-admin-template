/**
 * Format a Date / timestamp / date-string into a custom format.
 * Placeholders: {y} year, {m} month, {d} day, {h} hour, {i} minute, {s} second, {a} day-of-week.
 */
export function parseTime(
  time: Date | number | string | null | undefined,
  cFormat: string = '{y}-{m}-{d} {h}:{i}:{s}',
): string | null {
  if (time === null || time === undefined || time === '') {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time, 10)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  // Reject invalid dates (e.g. new Date('not-a-date') → Invalid Date)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  const formatObj: Record<string, number> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (_result, key) => {
    const value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * Relative time formatter: "刚刚", "N 秒前", "N 分钟前", "N 小时前", "N 天前",
 * or falls back to parseTime for older dates.
 */
export function formatTime(time: Date | number | string | null | undefined, option?: string): string {
  if (time === null || time === undefined || (typeof time === 'string' && time === '')) {
    return ''
  }
  const d = typeof time === 'object' ? (time as Date) : new Date(time)
  const now = Date.now()
  const diff = (now - d.getTime()) / 1000

  if (diff < 30) {
    return '刚刚'
  }
  if (diff < 3600) {
    return `${Math.ceil(diff / 60)} 分钟前`
  }
  if (diff < 3600 * 24) {
    return `${Math.ceil(diff / 3600)} 小时前`
  }
  if (diff < 3600 * 24 * 2) {
    return '1 天前'
  }
  if (diff < 3600 * 24 * 30) {
    return `${Math.ceil(diff / (3600 * 24))} 天前`
  }
  return parseTime(d, option || '{y}-{m}-{d}') ?? ''
}

/**
 * Parse a URL query string ("?a=1&b=2") into a plain object.
 */
export function param2Obj(url: string): Record<string, string> {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}',
  )
}
