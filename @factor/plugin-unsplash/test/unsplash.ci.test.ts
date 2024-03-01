/**
 * @vitest-environment happy-dom
 */
import fs from 'node:fs'
import { beforeAll, describe, expect, it } from 'vitest'
import type { TestUtils } from '@factor/api/test-utils'
import { createTestUtils, testEnvFile } from '@factor/api/test-utils'
import { FactorUnsplash } from '..'

let testUtils: (TestUtils & { factorUnsplash?: FactorUnsplash }) | undefined

describe('user tests', () => {
  beforeAll(async () => {
    if (!fs.existsSync(testEnvFile))
      console.warn(`missing test env file ${testEnvFile}`)

    testUtils = await createTestUtils({ envFiles: [testEnvFile] })

    const unsplashAccessKey = testUtils.factorEnv.var('UNSPLASH_ACCESS_KEY')

    if (!unsplashAccessKey)
      throw new Error(`missing env vars key: unsplash${unsplashAccessKey?.length}`)

    testUtils.factorUnsplash = new FactorUnsplash({
      factorEnv: testUtils.factorEnv,
      factorUser: testUtils.factorUser,
      factorServer: testUtils.factorServer,
      unsplashAccessKey,
    })
    testUtils.initialized = await testUtils.init()
  })

  it('gets unsplash photos', async () => {
    const r = await testUtils?.factorUnsplash?.requests.Unsplash.request({
      _action: 'random',
    })

    expect(r?.status).toBe('success')
    const urls = r?.data?.map(d => d.urls).filter(Boolean)
    expect(urls?.length).toBe(30)

    const r2 = await testUtils?.factorUnsplash?.requests.Unsplash.request({ _action: 'search', query: 'dog' })

    expect(r2?.status).toBe('success')
    const urls2 = r?.data?.map(d => d.urls).filter(Boolean)
    expect(urls2?.length).toBe(30)
  }, 10000)
})
