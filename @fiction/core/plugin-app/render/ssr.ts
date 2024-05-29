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
import { vue } from '../../utils/libraries'
import { crossVar } from '../../utils/vars'

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

  startGlobals(args: { pathname: string, simulateWindow?: boolean }) {
    // set flag used to determine if app code is running in vite

    crossVar.set('IS_VITE', 'yes')

    const { pathname, simulateWindow = false } = args

    /**
     * Allow for window object during SSR. Potentially useful as libraries sometimes assume window.
     * However, this is probably a BAD idea as dependencies use window object to control node v browser behavior
     * and its global oriented, leading to errors with no traceable cause and effect.
     */
    if (simulateWindow) {
      // Simulate window object using jsdom
      const url = `${this.settings.appUrl}${pathname}`
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url })

      const r = populateGlobal(globalThis, dom.window, { bindFunctions: true })

      this.revertGlobal = r.revert
    }
  }

  revertGlobals() {
    crossVar.delete('IS_VITE')

    this.revertGlobal?.()
  }

  async getParts(args: { pathname: string, runVars: Partial<RunVars>, entryModule: Record<string, any> }) {
    const { entryModule, pathname, runVars } = args
    let out = this.init()

    // use effect scope to capture all potential memory leaks
    // from watchers and computed to clear them after rendering
    // https://vuejs.org/api/reactivity-advanced.html#effectscope
    const scope = vue.effectScope()

    await scope.run(async () => {
      const { runAppEntry } = entryModule as EntryModuleExports

      const fictionAppEntry = await runAppEntry({ renderRoute: pathname, runVars })

      if (!fictionAppEntry)
        throw new Error('SSR Error: rendering failed')

      const { app, meta } = fictionAppEntry

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
    })

    scope.stop()

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

  async render(args: { pathname: string, mode: 'dev' | 'prod' | 'test', runVars: Partial<RunVars> }): Promise<RenderedHtmlParts> {
    const { pathname, mode, runVars } = args
    try {
      this.startGlobals({ pathname })
      if (mode === 'prod')
        return await this.renderProd({ pathname, runVars })
      else
        return await this.renderDev({ pathname, runVars })
    }
    catch (error) {
      logger.error(`SSR Error (${args.pathname}) - ${(error as Error).message}`, { error })
      return this.init()
    }
    finally {
      this.revertGlobals()
    }
  }
}
