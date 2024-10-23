import type { ServiceConfig } from '@fiction/core/index.js'
import { FictionPosts } from '@fiction/posts'
import { setup as siteSetupMain } from '@fiction/site/test/testUtils.main.js'
import { FictionNewsletter } from '..'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const mainFilePath = new URL(import.meta.url).pathname

  const siteServiceConfig = await siteSetupMain({ ...args, mainFilePath })

  const fictionPosts = new FictionPosts({ ...siteServiceConfig.service })
  const fictionNewsletter = new FictionNewsletter({ ...siteServiceConfig.service, fictionPosts })

  return {
    ...siteServiceConfig,
    service: { ...siteServiceConfig.service, fictionPosts, fictionNewsletter },
  } satisfies ServiceConfig
}
