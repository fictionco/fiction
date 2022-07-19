import { HeadClient } from "@vueuse/head"
import type { App } from "vue"
import { FactorAppEntry, ServiceList } from "../plugin-env"

export interface RenderOptions {
  mode: "production" | "development"
  debug?: boolean
}

export type RenderConfig = {
  pathname?: string
  manifest?: Record<string, any>
  template?: string
}

export interface HtmlBuildingBlocks {
  template: string
  mode: "production" | "development"
  manifest: Record<string, any>
}

export type HtmlGenerateParts = HtmlBuildingBlocks & {
  url: string
}

export interface RenderedHtmlParts {
  htmlBody: string
  preloadLinks: string
  htmlHead: string
  htmlAttrs: string
  bodyAttrs: string
}

export type EntryModuleExports = {
  runViteApp: (c: { renderUrl?: string }) => Promise<FactorAppEntry>
  [key: string]: unknown
}

export interface SitemapConfig {
  paths: string[]
  topic: string
}
