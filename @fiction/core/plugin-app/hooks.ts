import type { Express } from 'express'
import type { InlineConfig } from 'vite'
import type { FictionAppEntry } from '../plugin-env/index.js'
import '@fiction/core/plugin-env/hooks'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    beforeAppMounted: { args: [FictionAppEntry] }
    viteConfig: { args: [InlineConfig[]] }
    headTags: { args: [string, { pathname?: string }] }
    htmlBody: { args: [string, { pathname?: string }] }
    expressApp: { args: [{ expressApp: Express, mode: 'prod' | 'dev' | 'test' }] }
  }
}
