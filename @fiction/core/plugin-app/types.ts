import type { RunVars } from '../inject.js'
import type { FictionAppEntry, ServiceConfig } from '../plugin-env/index.js'
import type { SSR } from './render/ssr.js'

export interface IndexTemplates {
  main: { location: string, html?: string }
  [key: string]: { location: string, html?: string }
}

export interface RenderOptions {
  mode: 'production' | 'development'
  debug?: boolean
}

export interface RenderConfig {
  manifest?: Record<string, any>
  template?: string
  runVars?: Partial<RunVars>
  ssr: SSR
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
  runAppEntry: (c: { renderRoute?: string, runVars?: Partial<RunVars>, serviceConfig: ServiceConfig }) => Promise<FictionAppEntry>
  [key: string]: unknown
}
