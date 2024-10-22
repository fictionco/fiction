import type { ServiceConfig } from '@fiction/core/index.js'
import type { FictionAi } from '@fiction/plugin-ai/index.js'
import { setup as siteSetupMain } from '@fiction/site/test/testUtils.main.js'
import { FictionSubscribe } from '../index.js'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const mainFilePath = new URL(import.meta.url).pathname

  const siteServiceConfig = await siteSetupMain({ ...args, mainFilePath })

  return {
    ...siteServiceConfig,
  } satisfies ServiceConfig
}
