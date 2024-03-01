import path from 'node:path'
import type http from 'node:http'
import fs from 'fs-extra'
import type {
  FactorApp,
  FactorDb,
  FactorEnv,
  HookType,
  Organization,
  vue,
} from '@factor/api'
import {
  FactorBundle,
  FactorPlugin,
  createExpressApp,
  express,
  safeDirname,
} from '@factor/api'
import type { FactorCache } from '@factor/api/plugin-cache'
import { FactorTestingApp } from '@factor/api/plugin-testing-app'
import type { TagSettings } from '@factor/api/tag/types'

export type TagHookDictionary = {
  tagSettings: { args: [TagSettings & { [key: string]: unknown }] }
}

interface PageLinesTagSettings {
  scriptPort?: number
  testAppPort?: number
  testAppLiveUrl?: string
  scriptLiveUrl?: string
  isLive?: vue.Ref<boolean>
  mode?: 'development' | 'production'
  factorDb: FactorDb
  factorEnv: FactorEnv
  factorCache: FactorCache
  factorApp: FactorApp
  intervalSeconds?: number
  statSeconds?: number
  isTest?: boolean
  tagSettings?: Partial<TagSettings>
  testHeadless?: boolean
  testUiSpeed?: number
  hooks?: HookType<TagHookDictionary>[]
}

interface TagBuildOpts {
  organizationIds?: string[]
  tagSettings?: TagSettings & { [key: string]: unknown }
  disableWatch?: boolean
}

export class PageLinesTag extends FactorPlugin<PageLinesTagSettings> {
  factorDb = this.settings.factorDb
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorCache = this.settings.factorCache
  scriptPort = this.settings.scriptPort
  scriptLiveUrl = this.settings.scriptLiveUrl

  testAppPort = this.settings.testAppPort
  testAppLiveUrl = this.settings.testAppLiveUrl
  testAppUrl = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive?.value || false
    return isLive && this.testAppLiveUrl
      ? this.testAppLiveUrl
      : `http://localhost:${this.testAppPort}`
  })

  intervalSeconds = this.settings.intervalSeconds || 2
  statSeconds = this.settings.statSeconds || 7
  packagesPath = safeDirname(import.meta.url, '../..')
  server?: http.Server
  isRestart = false
  closeCallbacks: (() => void | Promise<void>)[] = []
  tagText?: string
  isTest = this.settings.isTest
  tagSettings = this.settings.tagSettings || {}
  testHeadless = this.settings.testHeadless || false
  testUiSpeed = this.settings.testUiSpeed || 1000
  factorTestingApp = new FactorTestingApp({
    factorEnv: this.factorEnv,
    port: this.testAppPort,
    headless: this.testHeadless,
    uiSpeed: this.testUiSpeed,
    mode: 'production',
    liveUrl: this.testAppLiveUrl,
    isLive: this.settings.isLive,
  })

  hooks = this.settings.hooks || []
  scriptUrl = this.utils.vue.computed(() => {
    const isLive = this.factorEnv.isProd?.value || false
    return isLive && this.scriptLiveUrl
      ? this.scriptLiveUrl
      : `http://localhost:${this.scriptPort}`
  })

  url = (organizationId: string) => {
    return this.utils.vue.computed(() => {
      return `${this.scriptUrl.value}/load.js?o=${organizationId}`
    })
  }

  constructor(settings: PageLinesTagSettings) {
    super('tag', settings)
  }

  addHook(hook: HookType<TagHookDictionary>): void {
    this.hooks.push(hook)
  }

  addTagSetting(name: string, value: string) {
    this.tagSettings[name] = value
  }

  getTagText(): string {
    if (!this.tagText) {
      const tagDir = path.join(this.builtScriptDir(), 'dist', 'tag')

      const tagFile = path.join(tagDir, 'index.js')

      const exists = fs.existsSync(tagFile)

      if (!exists)
        throw new Error(`tag has not been built ${tagFile}`)

      this.tagText = fs.readFileSync(tagFile, 'utf8')
    }
    return this.tagText
  }

  async getOrganizationSettings({
    organizationId,
  }: {
    organizationId: string
  }): Promise<Organization | undefined> {
    const sql = this.factorDb.client()

    const r = await sql
      .select<Organization[]>('*')
      .from(this.tbl.org)
      .where({ organizationId })
      .first()

    return r
  }

  getOrganizationTagSettings(
    organization?: Partial<Organization>,
  ): Partial<Organization> {
    if (!organization)
      return {}

    const out: Record<string, any> = {}

    const cols = this.factorDb.getColumns(this.tbl.org)

    cols?.forEach(({ key, isPrivate }) => {
      const k = key as keyof Organization
      if (!isPrivate && organization[k]) {
        const value = organization[k]
        out[key] = value
      }
    })

    return out as Partial<Organization>
  }

  async getTagSettings<T extends TagSettings = TagSettings>(opts: {
    organizationId: string
    tagSettings?: TagSettings
  }): Promise<T> {
    if (!opts.organizationId)
      throw new Error('organizationId is required')

    const { organizationId } = opts

    const rawProjectData = await this.getOrganizationSettings({
      organizationId,
    })
    const filteredData = this.getOrganizationTagSettings(rawProjectData) ?? {
      organizationId,
    }

    const organization = { ...filteredData, organizationId } as Organization

    let theIp
    if (!this.factorEnv.isProd?.value) {
      const { ip } = await import('address')

      theIp = ip() as string
    }

    const baseTagSettings: TagSettings = {
      ip: theIp || '',
      mode: this.factorEnv.isDev.value ? 'development' : 'production',
      organization,
      intervalSeconds: this.intervalSeconds,
      statSeconds: this.statSeconds,
      ...this.tagSettings,
      ...opts.tagSettings,
    }

    // allow modules to add additional settings (e.g. events)
    const tagSettings = await this.utils.runHooks<
      TagHookDictionary,
      'tagSettings'
    >({
      list: this.hooks,
      hook: 'tagSettings',
      args: [baseTagSettings],
    },
    )

    return tagSettings as T
  }

  async getEntryFileText(opts: {
    organizationId: string
    tagSettings?: TagSettings
  }) {
    const tagSettings = await this.getTagSettings(opts)

    return [
      `console.log('Starting PageLines Tag (https://www.pagelines.com)')`,
      `const tagSettings = ${JSON.stringify(tagSettings, null, 2)}`,
      `import('${this.scriptUrl.value}/index.js').then(({ initialize }) => initialize(tagSettings))`,
    ].join('\n')
  }

  async dev(opts: TagBuildOpts = {}): Promise<void> {
    if (this.factorEnv.isApp.value)
      return

    const factorBundle = new FactorBundle({ factorEnv: this.factorEnv })

    const watchers = await factorBundle.bundlePackages({
      cwds: [this.builtScriptDir()],
      watch: !opts.disableWatch,
      isTest: this.isTest,
      onAllBuilt: async () => {
        await this.tagStaticServer(opts)
      },
    })

    this.closeCallbacks.push(async () => {
      watchers.map(w => w.close())
    })
  }

  async close() {
    await Promise.all(this.closeCallbacks.map(cb => cb()))
    this.closeCallbacks = []
  }

  builtScriptDir(): string {
    const p = path.join(this.packagesPath, 'tag/package.json')
    return path.dirname(p)
  }

  async cacheTag(
    args: { organizationId: string } & (
      | {
        _action: 'get' | 'bust'
      }
      | { _action: 'set', tag: string }
    ),
  ): Promise<string | undefined> {
    const { _action, organizationId } = args
    const cache = this.factorCache.getCache()
    if (!cache)
      throw new Error('no tag cache')

    const key = this.factorCache.redisKey('tag', organizationId)

    if (_action === 'get')
      return (await cache.get(key)) ?? undefined
    else if (_action === 'set')
      await cache.set(key, args.tag)
    else if (_action === 'bust')
      await cache.del(key)
  }

  async tagStaticServer(opts: TagBuildOpts = {}): Promise<void> {
    const { tagSettings } = opts
    if (this.server) {
      this.isRestart = true
      this.server.close()
    }

    const app = createExpressApp({ noHelmet: true })

    app.use(
      '/',
      express.static(path.join(this.builtScriptDir(), 'dist', 'tag')),
    )
    app.use('/load.js', async (req, res) => {
      const { originalUrl, query } = req

      if (originalUrl.includes('favicon'))
        return res.writeHead(200).end()

      // Get the organizationId from the query parameters.
      const organizationId = query.o as string | undefined

      // If the organizationId is not provided, return a 404 response.
      if (!organizationId) {
        this.log.error('OrganizationId could not be determined', {
          data: { originalUrl },
        })
        return res.writeHead(404).end('/* no organizationId */')
      }

      const parts = await Promise.all([
        this.getEntryFileText({ tagSettings, organizationId }),
      ])

      res.header('Content-Type', 'text/javascript')
      res.send(parts.join('\n\n'))
    })

    app.use('*', async (req, res) => {
      res.header('Content-Type', 'text/javascript')
      return res.writeHead(404).end('/* not found */')
    })

    this.server = app
      .listen(this.scriptPort, () => {
        const message = `static tag server ${
          this.isRestart ? 'restarted' : 'started'
        }`
        this.log.info(message, {
          data: { url: this.url('example').value },
        })
      })
      .on('error', (error) => {
        this.log.error('listen error', { error })
      })
  }
}
