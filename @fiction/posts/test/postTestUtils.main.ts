import { setup as siteSetupMain } from '@fiction/site/test/testUtils.main.js'
import { FictionPosts } from '../index.js'
import '@fiction/plugin-ai'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const mainFilePath = new URL(import.meta.url).pathname

  const siteServiceConfig = await siteSetupMain({ ...args, mainFilePath })

  const fictionPosts = new FictionPosts({ ...siteServiceConfig.service })

  return {
    ...siteServiceConfig,
    service: { ...siteServiceConfig.service, fictionPosts },
  }
}
