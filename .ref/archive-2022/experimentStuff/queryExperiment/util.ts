/**
 * Return confidence p-value from a z-score
 * https://stackoverflow.com/a/16197404/1858322
 */
export function getZPercent(z: number): number {
  // z === number of standard deviations from the mean

  // if z is greater than 6.5 standard deviations from the mean
  // the number of significant digits will be outside of a reasonable
  // range
  if (z < -6.5)
    return 0
  if (z > 6.5)
    return 1

  let factK = 1
  let sum = 0
  let term = 1
  let k = 0
  const loopStop = Math.exp(-23)
  while (Math.abs(term) > loopStop) {
    term
      = (((0.398_942_280_4 * (-1) ** k * z ** k)
      / (2 * k + 1)
      / 2 ** k)
      * z ** (k + 1))
      / factK
    sum += term
    k++
    factK *= k
  }
  sum += 0.5

  return sum
}
