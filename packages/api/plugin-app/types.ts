import { HeadClient } from "@vueuse/head"
import { App } from "vue"
import { Router } from "vue-router"
import { RunConfig } from "../cli/utils"

export interface RenderOptions {
  mode: "production" | "development"
  debug?: boolean
}

export type RenderConfig = {
  pathname?: string
  manifest?: Record<string, any>
  template?: string
} & RunConfig

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
  runApp: (c: { renderUrl?: string }) => Promise<FactorAppEntry>
}
