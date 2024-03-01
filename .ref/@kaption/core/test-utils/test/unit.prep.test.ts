import { describe, expect, it } from 'vitest'
import { createKaptionTestUtils } from '..'

describe('test if services are up', () => {
  it('has postgres', async () => {
    const testUtils = await createKaptionTestUtils()

    testUtils.initialized = await testUtils.init()

    expect(testUtils.factorDb).toBeDefined()
    expect(testUtils.kaptionClickHouse).toBeDefined()
  })
})
