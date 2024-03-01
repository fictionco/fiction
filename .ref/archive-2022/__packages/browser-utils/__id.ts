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
