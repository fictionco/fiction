import { HeadClient } from "@vueuse/head"
import { App, Ref } from "vue"
import { Router } from "vue-router"

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
  appHtml: string
  preloadLinks: string
  headTags: string
  htmlAttrs: string
  bodyAttrs: string
}

export interface FactorAppEntry {
  app: App
  meta: HeadClient
  router: Router
}

export type EntryModuleExports = {
  runViteApp: (c: { renderUrl?: string }) => Promise<FactorAppEntry>
  [key: string]: unknown
}

export interface SitemapConfig {
  paths: string[]
  topic: string
}
