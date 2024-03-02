import type {
  FactorDb,
  FactorPluginSettings,
  FactorRouter,
  MarkdownFile,
  PostOrPage,
  vue,
} from '@factor/api'
import {
  FactorPlugin,
  fileToPost,
  onBrowserEvent,
} from '@factor/api'
import { minimatch } from 'minimatch'
import { marked } from 'marked'
import { config as sectionList } from './sections'

marked.use({ gfm: true })

export interface UiConfig { button?: { el: vue.Component } }

export type EngineOptions = {
  factorDb: FactorDb
  factorRouter: FactorRouter
  staticPosts: (() => Promise<MarkdownFile>)[]
  header: RegionEntry[]
  footer: RegionEntry[]
  page: RegionEntry[]
  ui: UiConfig
} & FactorPluginSettings

export interface ListingEntry {
  key?: string
  el?: vue.Component
  opts?: vue.ComputedRef<any>
}

export interface SectionConfig {
  id: string
  el?: vue.Component
  classes?: string
  settings: Record<string, any>
}

export interface RegionEntry {
  id?: string
  route?: string
  overlayHeader?: boolean
  layout: SectionConfig[]
}

type ConfigSection = SectionConfig & ListingEntry

export interface EngineConfig {
  classes: vue.ComputedRef<string> | string
  sections: vue.ComputedRef<ConfigSection[]> | ConfigSection[]
}

export class FactorEngine extends FactorPlugin<EngineOptions> {
  pageState = {
    scrolled: this.utils.vue.ref(false),
  }

  staticPosts = this.settings.staticPosts
  header = this.settings.header
  footer = this.settings.footer
  page = this.settings.page
  ui = this.settings.ui || {}
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: EngineOptions) {
    super('engine', settings)

    this.factorEnv?.uiPaths.push(
      `${this.root}/ui/**/*.{vue,js,ts,html}`,
      `${this.root}/sections/**/*.{vue,js,ts,html}`,
    )
    onBrowserEvent('scroll', () => {
      this.pageState.scrolled.value = window.pageYOffset > 20
    })
  }

  currentPage = this.utils.vue.computed(() => {
    const current = this.settings.factorRouter.current.value

    const page = this.page.find((p) => {
      const r
        = p.route
        && (p.route === current.path || minimatch(current.path, p.route))

      return r
    })

    return page
  })

  getUi(args: { ui: keyof UiConfig }) {
    const { ui } = args
    const out = this.ui[ui]

    return out
  }

  getRegionConfig(region: 'page' | 'header' | 'footer'): EngineConfig {
    return {
      classes: this.utils.vue.computed(() => {
        const currentPage = this.currentPage.value
        let out = ''
        if (region === 'header' && currentPage?.overlayHeader) {
          const sc = this.pageState.scrolled.value

          out = `fixed w-full z-50 transition-all ${
            sc ? 'bg-white shadow' : 'text-white'
          }`
        }

        return out
      }),
      sections: this.utils.vue.computed(() => {
        const currentPage = this.currentPage.value

        let layout: SectionConfig[]
        if (region === 'header')
          layout = this.header[0].layout
        else if (region === 'footer')
          layout = this.footer[0].layout
        else
          layout = currentPage?.layout || []

        const r = layout
          .map((l) => {
            const v = sectionList.find(
              section => l.settings.sectionKey === section.key,
            )

            return { ...v, ...l }
          })
          .filter(Boolean)
        return r || []
      }),
    }
  }

  getSectionSettings<T extends Record<string, any>>(
    sectionId: string,
  ): T | undefined {
    const allSections = [...this.page, ...this.header, ...this.footer].flatMap(
      item => item.layout,
    )

    const v = allSections.find(l => l.id === sectionId)
    return v?.settings as T | undefined
  }

  async getCurrentPost(): Promise<PostOrPage | undefined> {
    const current = this.settings.factorRouter.current.value
    const path = current.path
    const postIdOrPermalink = path.split('/').pop()

    const posts = await this.getPosts({ limit: 100, offset: 0 })

    const post = posts.find(
      p =>
        p.postId === postIdOrPermalink || p.permalink === postIdOrPermalink,
    )

    return post
  }

  async getPosts(_args: {
    limit?: number
    offset?: number
  }): Promise<PostOrPage[]> {
    const ps = await Promise.all(
      this.staticPosts.map(async (p) => {
        return await fileToPost(p)
      }),
    )

    return ps
  }
}
