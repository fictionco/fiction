import { beforeAll, describe, expect, it } from 'vitest'
import { magnitude } from '../ui'

describe('utils', () => {
  beforeAll(async () => {})

  it('gets number magnitude', () => {
    expect(magnitude(3230)).toBe(1000)
    expect(magnitude(823_000)).toBe(100_000)
  })
})
