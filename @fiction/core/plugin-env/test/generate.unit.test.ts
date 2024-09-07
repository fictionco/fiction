import path from 'node:path'
import { generateStaticConfig } from '@fiction/core/plugin-env/generate.js'
import { createTestUtils } from '@fiction/core/test-utils/init.js'
import { safeDirname } from '@fiction/core/utils'
import fs from 'fs-extra'
import { beforeAll, describe, expect, it } from 'vitest'

const root = new URL('.', import.meta.url).pathname
describe('test config generator', () => {
  beforeAll(async () => {
    const testUtils = createTestUtils({
      cwd: safeDirname(import.meta.url),
    })

    testUtils.fictionEnv.addHook({
      hook: 'staticConfig',
      caller: 'testGenerate',
      context: 'cli',
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
    expect(config.default.test[0]).toBe('test')
  })
})
