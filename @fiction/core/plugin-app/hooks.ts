import '@fiction/core/plugin-env/hooks'
import type { InlineConfig } from 'vite'
import type { Express } from 'express'
import type { FictionAppEntry, ServiceList } from '../plugin-env'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    beforeAppMounted: { args: [FictionAppEntry] }
    appMounted: { args: [FictionAppEntry] }
    afterAppSetup: { args: [{ service: ServiceList }] }
    viteConfig: { args: [InlineConfig[]] }
    headTags: { args: [string, { pathname?: string }] }
    htmlBody: { args: [string, { pathname?: string }] }
    expressApp: { args: [{ expressApp: Express, mode: 'prod' | 'dev' | 'test' }] }
  }
}
