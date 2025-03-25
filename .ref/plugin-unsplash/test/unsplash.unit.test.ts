/**
 * @vitest-environment happy-dom
 */

import fs from 'node:fs'
import { createTestUtils, testEnvFile } from '@fiction/core/test-utils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionUnsplash } from '..'

describe('user tests', async () => {
  const testUtils = createTestUtils({ envFiles: [testEnvFile] })

  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const unsplashAccessKey = testUtils.fictionEnv.var('UNSPLASH_ACCESS_KEY')

  if (!unsplashAccessKey)
    throw new Error(`missing env vars key: unsplash${unsplashAccessKey?.length}`)

  const fictionUnsplash = new FictionUnsplash({
    fictionEnv: testUtils.fictionEnv,
    fictionUser: testUtils.fictionUser,
    fictionServer: testUtils.fictionServer,
    unsplashAccessKey,
  })

  await testUtils.init()

  afterAll(() => testUtils.close())

  it('gets unsplash photos', async () => {
    const r = await fictionUnsplash?.requests.Unsplash.request({
      _action: 'random',
    })

    expect(r?.status).toBe('success')
    const urls = r?.data?.map(d => d.urls).filter(Boolean)
    expect(urls?.length).toBe(30)

    const r2 = await fictionUnsplash?.requests.Unsplash.request({ _action: 'search', query: 'dog' })

    expect(r2?.status).toBe('success')
    const urls2 = r?.data?.map(d => d.urls).filter(Boolean)
    expect(urls2?.length).toBe(30)
  }, 20000)
})
