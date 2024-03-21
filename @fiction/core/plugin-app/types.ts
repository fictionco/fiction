import type { RunVars } from '../inject'
import type { FictionAppEntry } from '../plugin-env'

export interface IndexTemplates {
  main: { location: string, html?: string }
  [key: string]: { location: string, html?: string }
}

export interface RenderOptions {
  mode: 'production' | 'development'
  debug?: boolean
}

export interface RenderConfig {
  pathname?: string
  manifest?: Record<string, any>
  template?: string
  isProd: boolean
  runVars?: Record<string, string>
}

export interface HtmlBuildingBlocks {
  template: string
  mode: 'production' | 'development'
  manifest: Record<string, any>
}

export type HtmlGenerateParts = HtmlBuildingBlocks & {
  url: string
}

export interface RenderedHtmlParts {
  htmlBody: string
  headTags: string
  bodyTags: string
  bodyTagsOpen: string
  htmlAttrs: string
  bodyAttrs: string
}

export interface EntryModuleExports {
  runAppEntry: (c: { renderRoute?: string, runVars?: Partial<RunVars> }) => Promise<FictionAppEntry>
  [key: string]: unknown
}

export type SiteMapEntry =
  | (() => SitemapConfig)
  | (() => Promise<SitemapConfig>)

export interface SitemapConfig {
  paths: string[]
  topic: string
}
