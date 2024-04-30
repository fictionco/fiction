/**
 * Generates a unique identifier similar to MongoDB's ObjectId.
 * The ID consists of a prefix, a timestamp part, and a random part.
 * The prefix is trimmed or used as is to maintain a total length of 27 characters for the ID.
 *
 * @param {object} [args] - The arguments object.
 * @param {string} [args.prefix] - The prefix for the ID. Trimmed to 3 characters if longer.
 * @returns {string} The generated unique identifier.
 */
export function objectId({ prefix = 'id_' } = {}): string {
  // Ensure the prefix is at least 3 characters, padding if necessary
  const effectivePrefix = prefix.length >= 3 ? prefix.substring(0, 3) : prefix.padEnd(3, '_')

  // Generate a timestamp part of 8 characters
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')

  // Generate the random part to reach a total length of 27 (including prefix)
  let randomPart = ''
  for (let i = 0; i < 16; i++)
    randomPart += Math.floor(Math.random() * 16).toString(16)

  return effectivePrefix + timestamp + randomPart
}
/**
 * Standard format globally unique ID
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(
    /[xy]/g,
    (c) => {
      const r = Math.trunc(Math.random() * 16)
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    },
  )
}
/**
 * Gets a short ID consisting only of lowercase letters
 *  - needed in DB, lowercase only means it's immune to transforms of case (snake_case to camelCase)
 */
export function shortId(args: { len?: number, withNumbers?: boolean, prefix?: string } = {}): string {
  const { len = 5, withNumbers = false, prefix = '' } = args
  const characters = withNumbers
    ? 'abcdefghijklmnopqrstuvwxyz123456789'
    : 'abcdefghijklmnopqrstuvwxyz'

  let result = ''
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return `${prefix}${result}`
}
