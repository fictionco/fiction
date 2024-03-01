import type { EndpointResponse, vue } from '@factor/api'
import { FactorObject } from '@factor/api'
import type { KaptionIntegrations } from '@kaption/connect'
import type {
  KaptionEndpointMap,
  KaptionPluginSettings,
} from '../utils'
import {
  KaptionEndpoint,
  KaptionPlugin,
} from '../utils'
import { Dashboard } from '../plugin-dashboards'
import type { KaptionCache } from '../plugin-cache'
import { getRoutes } from './routes'
import { formTable, integrationColumns } from './tables'
import { QueryFormsIndex, QueryManageForms } from './endpoint'
import { Form } from './form'
import type { CardConfig } from './card'

interface CardSettings {
  el: vue.Component
  type: string
}

export type FormEditMode = 'create' | 'design' | 'share' | 'integrations'

export class Card extends FactorObject<CardSettings> {
  type: string
  constructor(settings: CardSettings) {
    super('card', settings)
    this.type = 'card'
  }
}

type KaptionFormsSettings = {
  kaptionIntegrations?: KaptionIntegrations
  kaptionCache: KaptionCache
  port?: number
  liveUrl?: string
  isLive?: vue.Ref<boolean>
} & KaptionPluginSettings
export class KaptionForms extends KaptionPlugin<KaptionFormsSettings> {
  kaptionIntegrations = this.settings.kaptionIntegrations
  kaptionCache = this.settings.kaptionCache
  root = this.utils.safeDirname(import.meta.url)
  port = this.settings.port
  liveUrl = this.settings.liveUrl
  url = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive?.value || false
    return isLive && this.liveUrl
      ? this.liveUrl
      : `${this.factorApp?.appUrl.value}/visualizer`
  })

  queries = this.createQueries()
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    endpointHandler: (opts) => {
      return new KaptionEndpoint({
        ...opts,
        factorAdmin: this.settings.factorAdmin,
      })
    },
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  activeFormIndexState = this.utils.vue.shallowRef<
    EndpointResponse<Form[] | undefined>
  >({
    status: 'loading',
    data: undefined,
  },
  )

  activeFormIndex = this.utils.vue.computed<Form[] | undefined>(() => {
    return this.activeFormIndexState?.value.data
  })

  activeFormState = this.utils.vue.shallowRef<
    EndpointResponse<Form | undefined>
  >({
    status: 'loading',
    data: undefined,
  },
  )

  activeForm = this.utils.vue.computed<Form | undefined>({
    get: () => {
      return this.activeFormState?.value.data
    },
    set: (v) => {
      if (v) {
        this.activeFormState.value = {
          ...this.activeFormState.value,
          data: { ...this.activeFormState.value.data, ...v },
        } as EndpointResponse<Form | undefined>
      }
    },
  })

  getFormUrl(formId: string) {
    return `${this.url.value}/${formId}`
  }

  activeFormUrl = this.utils.vue.computed(() => {
    const formId = this.activeForm.value?.formId
    return formId ? this.getFormUrl(formId) : undefined
  })

  formEditModes: { name: string, value: FormEditMode }[] = [
    { name: 'Create', value: `create` },
    { name: 'Design', value: `design` },
    { name: 'Share', value: 'share' },
    { name: 'Integrations', value: 'integrations' },
  ]

  editMode = this.utils.vue.computed<FormEditMode>({
    get: () => {
      const topic = this.factorRouter?.query.value.topic || 'create'
      return topic as FormEditMode
    },
    set: async (v) => {
      const query = this.factorRouter?.query.value
      await this.factorRouter?.replace({
        name: 'formBuilder',
        query: { ...query, topic: v },
      })
    },
  })

  constructor(settings: KaptionFormsSettings) {
    super('forms', settings)

    this.factorRouter?.update(getRoutes({ kaptionForms: this }))
    this.factorApp?.addUiPaths([
      `${this.root}/**/*.vue`,
      `${this.root}/*.ts`,
      `${this.root}/themes/**/*.ts`,
    ])
    this.kaptionDashboard?.addDashboards([
      new Dashboard({
        dashboardId: 'forms',
        dashboardName: 'Forms',
        layout: [{ widgetKey: 'uniqueVisitors' }],
        dashboardType: 'core',
      }),
    ])

    this.factorDb.addTables([formTable])

    // add formId column to integrations
    this.factorDb.addColumns('kaption_connect', integrationColumns)

    if (this.utils.hasWindow())
      this.watchLoader().catch(console.error)

    this.factorAdmin?.hooks.push({
      hook: 'menus',
      callback: (menus) => {
        menus.primary.push('formIndex')
        return menus
      },
    })
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      kaptionCache: this.kaptionCache,
    }
    return {
      ManageForms: new QueryManageForms(deps),
      FormsIndex: new QueryFormsIndex(deps),
    } as const
  }

  async loadForm(formId: string) {
    const requestPromise = this.requests.ManageForms.projectRequest({
      _action: 'retrieve',
      form: { formId },
    })

    this.activeFormState.value = {
      status: 'loading',
      data: undefined,
      loading: requestPromise,
    }

    const r = await requestPromise

    const loadedForm = {
      ...r,
      data: r.data ? new Form(r.data) : undefined,
    }

    this.activeFormState.value = loadedForm

    return loadedForm.data
  }

  async loadFormIndex() {
    const requestPromise = this.requests.FormsIndex.projectRequest({
      _action: 'list',
    })

    this.activeFormIndexState.value = {
      status: 'loading',
      data: undefined,
      loading: requestPromise,
    }

    const r = await requestPromise

    this.activeFormIndexState.value = {
      ...r,
      data: r.data ? r.data.map(f => new Form(f)) : undefined,
    }
  }

  async watchLoader() {
    await this.factorUser?.userInitialized()
    this.utils.vue.watch(
      () => {
        const currentRoute = this.factorRouter?.router.currentRoute.value
        return currentRoute
      },
      async (route) => {
        if (!route)
          return

        const routeName = route.name as string
        if (['formIndex', 'formBuilder'].includes(routeName)) {
          const formId = route.params.formId as string | undefined
          if (formId)
            await this.loadForm(formId)
          else
            await this.loadFormIndex()
        }
      },
      { immediate: true },
    )
  }

  async bulkEdit(params: { _action: 'delete', selectedIds: string[] }) {
    await this.requests.FormsIndex.projectRequest(params)
    await this.loadFormIndex()
  }

  updateCardById(cardId: string, cardConfig: Partial<CardConfig>) {
    if (!this.activeForm.value)
      throw new Error('no active form')

    const cards = this.activeForm.value.cards.value || []
    const index = cards.findIndex(c => c.cardId === cardId)
    const existing = this.activeForm.value.cards.value[index]
    if (index > -1 && existing)
      this.activeForm.value.cards.value[index] = { ...existing, ...cardConfig }
  }

  async saveActiveForm() {
    const form = this.activeForm.value?.toConfig()
    if (!form)
      throw new Error('no active form to save')
    return await this.requests.ManageForms.projectRequest({
      _action: 'update',
      form,
    })
  }
}
