import { describe, expect } from 'vitest'
import { standardPathname } from '../utils'

describe('utils', () => {
  it('standardPathname', async () => {
    const isRoot = standardPathname('https://www.testing.com')
    const isPath = standardPathname('https://www.testing.com/another-test')
    expect(isRoot).toBe('/')
    expect(isPath).toBe('/another-test')
  })
})
