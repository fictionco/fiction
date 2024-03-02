import path from 'node:path'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { beforeAll, describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import { safeDirname } from '@fiction/core/utils'
import { generateStaticConfig } from '@fiction/core/plugin-env/generate'

const root = new URL('.', import.meta.url).pathname
describe('test config generator', () => {
  beforeAll(async () => {
    const testUtils = await createTestUtils({
      cwd: safeDirname(import.meta.url),
    })

    testUtils.fictionEnv.addHook({
      hook: 'staticConfig',
      callback: async (schema) => {
        const test = ['test']

        const staticConfig = {
          ...schema,
          test,
        }

        return staticConfig
      },
    })

    await generateStaticConfig(testUtils.fictionEnv)
  })
  it('generates into correct folder', async () => {
    expect(fs.existsSync(path.join(root, '/.fiction'))).toBe(true)
  })

  it('has hooked data', async () => {
    const config = await import('./.fiction/config.json')
    expect(config.test[0]).toBe('test')
  })
})
