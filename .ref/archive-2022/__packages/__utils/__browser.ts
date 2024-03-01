import axios from 'axios'

/**
 * Create a unique ObjectID
 * https://stackoverflow.com/a/37438675/1858322
 */
export function createObjectId(idLength = 16): string {
  const nts = (s: number): string => Math.floor(s).toString(idLength)
  return (
    nts(Date.now() / 1000)
    + ' '.repeat(idLength).replace(/./g, () => nts(Math.random() * idLength))
  )
}
/**
 * Standard format globally unique ID
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.trunc(Math.random() * 16)
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
/**
 * Get IP address on network
 */
export async function getNetworkIp(): Promise<string> {
  const { data } = await axios.get<string>(
    'https://www.cloudflare.com/cdn-cgi/trace',
  )

  const rawText = data.split(`\n`).find((_: string) => _.includes('ip='))

  const ip = rawText?.split('=').pop() ?? ''

  return ip
}
