import { vue } from '@factor/api'
import type {
  KaptionEndpointMap,
  KaptionPluginSettings,
} from '../utils'
import {
  KaptionEndpoint,
  KaptionPlugin,
} from '../utils'
import routes from './routes'
import { QueryCurrentTrackingStatus, QueryManageTracking } from './query'

type KaptionTrackingSettings = {} & KaptionPluginSettings
export class KaptionTracking extends KaptionPlugin<KaptionTrackingSettings> {
  factorAdmin = this.settings.factorAdmin
  kaptionDashboard = this.settings.kaptionDashboard
  factorRouter = this.settings.factorRouter
  factorApp = this.settings.factorApp
  root = this.utils.safeDirname(import.meta.url)
  queries = this.createQueries()
  loopCounter = 0
  loopIntervalStart = 10_000
  loopTimeout?: NodeJS.Timeout
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    endpointHandler: (opts) => {
      return new KaptionEndpoint({ ...opts, factorAdmin: this.factorAdmin })
    },
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  constructor(settings: KaptionTrackingSettings) {
    super('tracking', settings)

    this.factorApp?.addUiPaths([`${this.root}/*.vue`])
    this.factorRouter?.update(routes)

    this.factorApp?.addHook({
      hook: 'appMounted',
      callback: async () => {
        this.utils.vue.watch(
          this.trackingStatus,
          async (v) => {
            if (v !== 'active') {
              this.log.info('initializing tracking check loop', { data: { v } })
              await this.refreshLoop()
            }
          },
          { immediate: true },
        )
      },
    })

    this.utils.vue.watch(
      () => this.trackingStatus.value,
      (v) => {
        if (!this.factorAdmin)
          return
        if (v === 'active') {
          delete this.factorAdmin.badges.value.tracking
        }
        else {
          this.factorAdmin.badges.value.tracking = {
            text: 'Waiting for Data',
            action: this.factorRouter?.link('trackingCode').value || '',
            actionText: '',
            color: 'amber',
          }
        }
      },
    )
  }

  trackingStatus = vue.computed(() => {
    const status = this.factorAdmin?.activeProject.value?.trackingStatus
    return status || 'unknown'
  })

  async refreshLoop() {
    if (this.loopTimeout)
      clearTimeout(this.loopTimeout)

    const nextCall = Math.min(
      this.loopIntervalStart + 1000 * this.loopCounter,
      120_000,
    )

    this.loopCounter++

    const project = this.factorAdmin?.activeProject

    if (project?.value)
      await this.requests.ManageTracking.projectRequest({ _action: 'refresh' })

    if (project?.value?.trackingStatus !== 'active') {
      this.loopTimeout = setTimeout(async () => {
        await this.refreshLoop()
      }, nextCall)
    }
  }

  protected createQueries() {
    const deps = {
      kaptionTracking: this,
      ...this.settings,
    }
    return {
      ManageTracking: new QueryManageTracking(deps),
      CurrentTrackingStatus: new QueryCurrentTrackingStatus(deps),
    } as const
  }
}
