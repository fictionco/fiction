import path from 'node:path'
import type http from 'node:http'
import fs from 'fs-extra'
import type { FictionDb, FictionEnv, HookType, vue } from '@fiction/core'
import {
  FictionBundle,
  FictionPlugin,
  createExpressApp,
  express,
  safeDirname,
} from '@fiction/core'
import { FictionTestingApp } from '@fiction/core/plugin-testing-app'
import type { Project } from '@fiction/core/plugin-admin'
import { AppTable } from '@fiction/core/plugin-admin'
import type { KaptionBeacon } from '../plugin-beacon'
import type { KaptionCache } from '../plugin-cache'
import { KaptionTrafficGenerator } from './traffic'
import type { TagSettings } from '../client-tag/types'

export * from '../client-tag/types'

export interface TagHookDictionary {
  tagSettings: { args: [TagSettings & { [key: string]: unknown }] }
}

interface FictionTagSettings {
  scriptPort: number
  testAppPort: number
  testAppLiveUrl?: string
  scriptLiveUrl?: string
  isLive?: vue.Ref<boolean>
  mode?: 'development' | 'production'
  factorDb: FictionDb
  factorEnv: FictionEnv
  kaptionBeacon: KaptionBeacon
  kaptionCache: KaptionCache
  intervalSeconds?: number
  statSeconds?: number
  isTest?: boolean
  tagSettings?: TagSettings & { [key: string]: unknown }
  testHeadless?: boolean
  testUiSpeed?: number
  hooks?: HookType<TagHookDictionary>[]
}

interface TagBuildOpts {
  projectIds?: string[]
  tagSettings?: TagSettings & { [key: string]: unknown }
}

export class KaptionTag extends FictionPlugin<FictionTagSettings> {
  factorDb = this.settings.factorDb
  factorEnv = this.settings.factorEnv
  kaptionBeacon = this.settings.kaptionBeacon
  kaptionCache = this.settings.kaptionCache
  isLive = this.settings.isLive
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
  factorTestingApp = new FictionTestingApp({
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
    const isLive = this.settings.isLive?.value || false
    return isLive && this.scriptLiveUrl
      ? this.scriptLiveUrl
      : `http://localhost:${this.scriptPort}`
  })

  url = (projectId: string) => {
    return this.utils.vue.computed(() => {
      return `${this.scriptUrl.value}/${projectId}.js`
    })
  }

  constructor(settings: FictionTagSettings) {
    super('tag', settings)
  }

  setup() {}

  addHook(hook: HookType<TagHookDictionary>): void {
    this.hooks.push(hook)
  }

  addTagSetting(name: string, value: string) {
    this.tagSettings[name] = value
  }

  getTagText(): string {
    if (!this.tagText) {
      const tagDir = path.join(this.clientTagDir(), 'dist', 'tag')

      const tagFile = path.join(tagDir, 'index.js')

      const exists = fs.existsSync(tagFile)

      if (!exists)
        throw new Error(`tag has not been built ${tagFile}`)

      this.tagText = fs.readFileSync(tagFile, 'utf8')
    }
    return this.tagText
  }

  async getProjectData({
    projectId,
  }: {
    projectId: string
  }): Promise<Project | undefined> {
    const sql = this.factorDb.client()

    const r = await sql
      .select<Project[]>('*')
      .from(AppTable.Projects)
      .where({ projectId })
      .first()

    return r
  }

  getProjectTagSettings(project?: Partial<Project>): Partial<Project> {
    if (!project)
      return {}

    const out: Record<string, any> = {}

    const cols = this.factorDb.getColumns('kaption_project')

    cols?.forEach(({ key, isPrivate }) => {
      const k = key as keyof Project
      if (!isPrivate && project[k]) {
        const value = project[k]
        out[key] = value
      }
    })

    return out as Partial<Project>
  }

  async getTagSettings<T extends TagSettings = TagSettings>(opts: {
    projectId: string
    tagSettings?: TagSettings
  }): Promise<T> {
    if (!opts.projectId)
      throw new Error('projectId is required')

    const { projectId } = opts

    const rawProjectData = await this.getProjectData({ projectId })
    const filteredData = this.getProjectTagSettings(rawProjectData) ?? {
      projectId,
    }

    const project = { ...filteredData, projectId } as Project

    let ip
    if (!this.isLive?.value) {
      const { default: address } = await import('address')

      ip = (await address.ip()) as string
    }

    const baseTagSettings: TagSettings = {
      ip: ip || '',
      mode: this.factorEnv.isDev.value ? 'development' : 'production',
      project,
      beaconUrl: this.kaptionBeacon.beaconUrl.value,
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
    projectId: string
    tagSettings?: TagSettings
  }) {
    const tagSettings = await this.getTagSettings(opts)
    return [
      `console.log('Starting Kaption Analytics/Forms (https://www.kaption.co)')`,
      `const tagSettings = ${JSON.stringify(tagSettings, null, 2)}`,
      `import('${this.scriptUrl.value}/index.js').then(({ initialize }) => initialize(tagSettings))`,
    ].join('\n')
  }

  async getTestingScriptTag(projectIds: string[]): Promise<string> {
    const head = [
      `<script>window.kaptionIsFake = true;</script>`,
      ...projectIds.map(
        projectId => `<script src="${this.url(projectId).value}"></script>`,
      ),
    ]
    return head.join('\n')
  }

  async launchExampleApp(projectIds: string[]) {
    const head = await this.getTestingScriptTag(projectIds)
    const testingApp = await this.factorTestingApp.createApp({ head })
    this.closeCallbacks.push(() => {
      testingApp?.close()
    })
    this.log.info(`example app @${this.factorTestingApp.url.value}`)
  }

  async generateTraffic() {
    const trafficGen = new KaptionTrafficGenerator({
      factorEnv: this.factorEnv,
      factorTestingApp: this.factorTestingApp,
      isLive: this.isLive,
    })

    await trafficGen.run({
      entryUrl: this.factorTestingApp.url.value,
    })
  }

  async dev(opts: TagBuildOpts = {}): Promise<void> {
    const { projectIds = [] } = opts
    const factorBundle = new FictionBundle({ factorEnv: this.factorEnv })

    const watchers = await factorBundle.bundlePackages({
      cwds: [this.clientTagDir(), this.clientDir()],
      watch: true,
      isTest: this.isTest,
      onAllBuilt: async () => {
        await this.tagStaticServer(opts)
        await this.kaptionBeacon.dev()
      },
    })

    await this.launchExampleApp(projectIds)

    this.closeCallbacks.push(async () => {
      watchers.map(w => w.close())
    })
  }

  async close() {
    await Promise.all(this.closeCallbacks.map(cb => cb()))
    this.closeCallbacks = []
  }

  clientDir(): string {
    const p = path.join(this.packagesPath, 'client/package.json')
    return path.dirname(p)
  }

  clientTagDir(): string {
    const p = path.join(this.packagesPath, 'client-tag/package.json')
    return path.dirname(p)
  }

  async cacheTag(
    args: { projectId: string } & (
      | {
        _action: 'get' | 'bust'
      }
      | { _action: 'set', tag: string }
    ),
  ): Promise<string | undefined> {
    const { _action, projectId } = args
    const cache = this.kaptionCache.getCache()
    if (!cache)
      throw new Error('no tag cache')

    const key = this.kaptionCache.redisKey('tag', projectId)

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

    const app = createExpressApp({ noHelmet: true, id: 'tagStaticServer' })

    app.use('/', express.static(path.join(this.clientTagDir(), 'dist', 'tag')))
    app.use('*', async (req, res) => {
      const { originalUrl } = req

      if (originalUrl.includes('favicon'))
        return res.writeHead(200).end()

      const projectId = path.basename(originalUrl).replace(/\.[^./]+$/, '')

      if (!projectId) {
        this.log.error('projectId could not be determined', {
          data: { originalUrl },
        })
        return res.writeHead(404).end()
      }
      const parts = await Promise.all([
        this.getEntryFileText({ tagSettings, projectId }),
      ])
      res.header('Content-Type', 'text/javascript')
      res.send(parts.join('\n\n'))
    })

    this.server = app
      .listen(this.scriptPort, () => {
        const message = `static tag server ${
          this.isRestart ? 'restarted' : 'started'
        }`
        this.log.info(message, { data: { url: this.url('projectId').value } })
      })
      .on('error', (error) => {
        this.log.error('listen error', { error })
      })
  }
}
