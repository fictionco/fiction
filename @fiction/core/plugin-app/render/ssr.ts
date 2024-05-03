import path from 'node:path'
import process from 'node:process'
import { renderSSRHead } from '@unhead/ssr'
import { renderToString } from '@vue/server-renderer'
import { JSDOM } from 'jsdom'
import type { ViteDevServer } from 'vite'
import type { RunVars } from '../../inject'
import { populateGlobal } from '../../utils/globalUtils'
import { FictionObject } from '../../plugin'
import type { EntryModuleExports, RenderedHtmlParts } from '../types'
import { log } from '../../plugin-log'

const logger = log.contextLogger('SSR')

export type SSRSettings = {
  appUrl: string
  distFolderServerMountFile: string
  mountFilePath: string
  viteServer?: ViteDevServer
}

export class SSR extends FictionObject<SSRSettings> {
  revertGlobal?: () => void

  init(): RenderedHtmlParts {
    return { bodyAttrs: '', headTags: '', htmlAttrs: '', bodyTags: '', bodyTagsOpen: '', htmlBody: '' }
  }

  constructor(settings: SSRSettings) {
    super('SSR', settings)
  }

  startWindow(args: { pathname: string }) {
    const { pathname } = args

    // set flag used to determine if app code is running in vite
    process.env.IS_VITE = 'yes'

    // Simulate window object using jsdom
    const url = `${this.settings.appUrl}${pathname}`
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url })

    const r = populateGlobal(globalThis, dom.window, { bindFunctions: true })

    this.revertGlobal = r.revert
  }

  revertWindow() {
    this.revertGlobal?.()
  }

  async getParts(args: { pathname: string, runVars: Partial<RunVars>, entryModule: Record<string, any> }) {
    const { entryModule, pathname, runVars } = args
    const { runAppEntry } = entryModule as EntryModuleExports

    const fictionAppEntry = await runAppEntry({ renderRoute: pathname, runVars })

    if (!fictionAppEntry)
      throw new Error('SSR Error: rendering failed')

    const { app, meta } = fictionAppEntry

    let out = this.init()

    /**
     * Pass context for rendering (available useSSRContext())
     * vitejs/plugin-vue injects code in component setup() that registers the component
     * on the context. Allowing us to orchestrate based on this.
     */

    const ctx: { modules?: string[] } = {}
    out.htmlBody = await renderToString(app, ctx)

    /**
     * Meta/Head Rendering
     */
    const head = await renderSSRHead(meta)
    out = { ...out, ...head }

    return out
  }

  async renderProd(args: { pathname: string, runVars: Partial<RunVars> }): Promise<RenderedHtmlParts> {
    const { pathname, runVars } = args

    const entryModule = (await import(/* @vite-ignore */ path.join(this.settings.distFolderServerMountFile))) as Record<string, any>

    const out = this.getParts({ pathname, runVars, entryModule })

    return out
  }

  async renderDev(args: { pathname: string, runVars: Partial<RunVars> }): Promise<RenderedHtmlParts> {
    const { pathname, runVars } = args

    if (!this.settings.viteServer)
      throw new Error('renderDev: ViteDevServer not found')

    const entryModule = await this.settings.viteServer.ssrLoadModule(this.settings.mountFilePath)

    const out = this.getParts({ pathname, runVars, entryModule })

    return out
  }

  async render(args: { pathname: string, isProd: boolean, runVars: Partial<RunVars> }): Promise<RenderedHtmlParts> {
    const { pathname, isProd, runVars } = args
    try {
      this.startWindow({ pathname })
      if (isProd)
        return await this.renderProd({ pathname, runVars })
      else
        return await this.renderDev({ pathname, runVars })
    }
    catch (error) {
      logger.error(`SSR Error (${args.pathname}) - ${(error as Error).message}`, { error })
      return this.init()
    }
    finally {
      this.revertWindow()
    }
  }
}
