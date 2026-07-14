/**
 * Validate whether a string is an external URL (http/https).
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * Validate a username: 4-20 chars, letters/digits/underscore.
 */
export function validUsername(str: string): boolean {
  return /^[a-zA-Z0-9_]{4,20}$/.test(str)
}
