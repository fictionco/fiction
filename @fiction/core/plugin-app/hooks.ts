import '@fiction/core/plugin-env/hooks'
import type { InlineConfig } from 'vite'
import type { Express } from 'express'
import type { FictionAppEntry } from '../plugin-env/index.js'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    beforeAppMounted: { args: [FictionAppEntry] }
    viteConfig: { args: [InlineConfig[]] }
    headTags: { args: [string, { pathname?: string }] }
    htmlBody: { args: [string, { pathname?: string }] }
    expressApp: { args: [{ expressApp: Express, mode: 'prod' | 'dev' | 'test' }] }
  }
}
