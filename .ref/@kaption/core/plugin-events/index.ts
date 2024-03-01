import type { EndpointResponse, ListItem } from '@factor/api'
import { vue } from '@factor/api'

import type {
  KaptionEndpointMap,
  KaptionPluginSettings,
} from '../utils'
import {
  KaptionEndpoint,
  KaptionPlugin,
} from '../utils'

import type { KaptionTag } from '../plugin-tag'
import type { KaptionCache } from '../plugin-cache'
import { getRoutes } from './routes'
import { getDashboards } from './dashboards'
import { QueryFindEvent, QueryManageCustomEvent } from './endpoint'
import type * as types from './types'
import type { CustomTrackEvent, ProjectWithEvents } from './types'
import { getAdminTables } from './tables'

type KaptionEventsSettings = {
  kaptionTag: KaptionTag
  kaptionCache: KaptionCache
} & KaptionPluginSettings

export class KaptionEvents extends KaptionPlugin<KaptionEventsSettings> {
  factorUser = this.settings.factorUser
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorServer = this.settings.factorServer
  factorAdmin = this.settings.factorAdmin
  kaptionDashboard = this.settings.kaptionDashboard
  kaptionTag = this.settings.kaptionTag
  kaptionCache = this.settings.kaptionCache
  queries = this.createQueries()
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    endpointHandler: (opts) => {
      return new KaptionEndpoint({ ...opts, factorAdmin: this.factorAdmin })
    },
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  root = this.utils.safeDirname(import.meta.url)
  tables = getAdminTables()
  constructor(settings: KaptionEventsSettings) {
    super('events', settings)

    this.factorRouter?.update(getRoutes())
    this.kaptionDashboard?.addDashboards(getDashboards())
    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`])
    this.factorDb.addTables(this.tables)
    this.kaptionTag.addHook({
      hook: 'tagSettings',
      callback: async (tagSettings) => {
        const { projectId } = tagSettings as ProjectWithEvents

        if (projectId) {
          const r = await this.queries.ManageCustomEvent.serve(
            {
              _action: 'getIndex',
              projectId,
            },
            {},
          )

          tagSettings.projectEvents = r.data || []
        }

        return tagSettings
      },
    })

    this.factorAdmin?.hooks.push({
      hook: 'menus',
      callback: (menus) => {
        menus.primary.push('eventIndex')
        return menus
      },
    })
  }

  setup() {}

  activeAvailableEvents = vue.computed<CustomTrackEvent[]>(() => {
    const proj = this.factorAdmin?.activeProject
      .value as types.ProjectWithEvents

    const events = proj?.projectEvents ?? {}

    const r = Object.values(events).filter(_ => _ && _.event && _.eventId)

    return r as CustomTrackEvent[]
  })

  activeEventIndexState = this.utils.vue.shallowRef<
    EndpointResponse<CustomTrackEvent[]>
  >({
    status: 'loading',
    data: undefined,
  },
  )

  activeEventIndex = this.utils.vue.computed<CustomTrackEvent[] | undefined>(
    () => {
      return this.activeEventIndexState?.value.data
    },
  )

  activeEventState = this.utils.vue.shallowRef<
    EndpointResponse<CustomTrackEvent[]>
  >({
    status: 'loading',
    data: undefined,
  },
  )

  activeEvent = this.utils.vue.computed<CustomTrackEvent | undefined>(() => {
    const data = this.activeEventState?.value.data || []
    return data[0]
  })

  async load(
    params: { _action: 'getIndex' } | { _action: 'getSingle', eventId: string },
  ): Promise<EndpointResponse<CustomTrackEvent[] | undefined>> {
    const requestPromise
      = this.requests.ManageCustomEvent.projectRequest(params)

    const loadingResponse: EndpointResponse<CustomTrackEvent[]> = {
      status: 'loading',
      data: undefined,
      loading: requestPromise,
    }

    let response: EndpointResponse<CustomTrackEvent[]> = { status: 'error' }
    if (params._action === 'getIndex') {
      this.activeEventIndexState.value = loadingResponse
      this.activeEventIndexState.value = await requestPromise
      response = this.activeEventIndexState.value
    }
    else if (params._action === 'getSingle') {
      this.activeEventState.value = loadingResponse
      this.activeEventState.value = await requestPromise
      response = this.activeEventState.value
    }

    return response
  }

  protected createQueries() {
    const deps = {
      ...this.settings,
      kaptionEvents: this,
    }
    return {
      ManageCustomEvent: new QueryManageCustomEvent(deps),
      FindEvent: new QueryFindEvent(deps),
    } as const
  }

  coreEvents = [
    {
      name: 'Rage Click',
      desc: 'A user rapidly clicked an element',
      value: 'rageClick',
    },
    {
      name: 'JavaScript Error',
      desc: 'An error was detected on the page',
      value: 'error',
    },
    {
      name: 'Bot',
      desc: 'Visitor flagged as likely bot',
      value: 'bot',
    },
  ]

  async bustEventContext(args: { projectId: string }) {
    const { projectId } = args
    const cache = this.kaptionCache.getCache()
    const findKeys = this.kaptionCache.redisKey(
      'project',
      projectId,
      'event',
      '*',
    )
    const keys = (await cache?.keys(findKeys)) || []

    await Promise.all(
      keys?.map(async (key: string) => {
        await cache?.del(key)
      }),
    )
  }

  async getEventConfig(args: {
    _action: 'get' | 'bust'
    event: string
    projectId: string
  }): Promise<CustomTrackEvent | undefined> {
    const { _action, projectId, event } = args
    if (!this.factorDb)
      throw new Error('Missing factorDb')
    try {
      const key = this.kaptionCache.redisKey(
        'project',
        projectId,
        'event',
        event,
      )
      const cache = this.kaptionCache.getCache()

      if (!cache)
        throw new Error('missing cache')

      if (_action === 'get') {
        const cachedEvent = await cache?.get(key)

        if (cachedEvent)
          return JSON.parse(cachedEvent) as CustomTrackEvent
      }
      else if (_action === 'bust') {
        await cache?.del(key)
      }

      const eventResponse = await this.queries.FindEvent.serve(
        { projectId, event },
        { server: true },
      )

      const config = eventResponse?.data

      if (config)
        await cache.set(key, JSON.stringify(config), 'EX', 60 * 60 * 24)

      return config
    }
    catch (error: unknown) {
      this.log.error('event config', { error, data: { projectId, event } })
    }
  }

  activeAllEvents = vue.computed<ListItem[]>(() => {
    const custom: ListItem[] = this.activeAvailableEvents.value.map((e) => {
      return {
        name: e.event,
        desc: e.conversion,
        type: 'event',
        value: e.event,
      }
    })

    return [...custom, ...this.coreEvents]
  })

  activeSelectEvents = vue.computed<ListItem[]>(() => {
    const custom: ListItem[] = this.activeAvailableEvents.value.map((e) => {
      return {
        name: e.event,
        desc: e.conversion,
        type: 'event',
        value: e.event,
      }
    })

    if (custom.length === 0) {
      custom.push({
        name: '(No custom goals created)',
        disabled: true,
      })
    }

    return [
      { name: 'Select', value: '' },
      ...custom,
      { format: 'divider' },
      {
        name: 'Create New Goal or Event',
        link: this.factorRouter?.link('customEvents').value,
      },
    ]
  })
}
