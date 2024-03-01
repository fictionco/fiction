import type {
  EndpointResponse,
  FactorApp,
  FactorDb,
  FactorMedia,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import type { KaptionEndpointMap } from '../utils'
import { KaptionEndpoint } from '../utils'
import type { KaptionCache } from '../plugin-cache'
import { FindOneForm } from './endpoint'
import { Form } from './form'

type KaptionFormLoaderSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorApp: FactorApp
  factorMedia: FactorMedia
  factorRouter: FactorRouter
  kaptionCache: KaptionCache
} & FactorPluginSettings

interface FormService {
  kaptionFormLoader: KaptionFormLoader
  factorMedia: FactorMedia
}

export class KaptionFormLoader extends FactorPlugin<KaptionFormLoaderSettings> {
  root = this.utils.safeDirname(import.meta.url)
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorServer = this.settings.factorServer
  factorMedia = this.settings.factorMedia
  factorDb = this.settings.factorDb
  kaptionCache = this.settings.kaptionCache

  queries = this.createQueries()
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    endpointHandler: (opts) => {
      return new KaptionEndpoint({
        ...opts,
      })
    },
    factorServer: this.factorServer,
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

  constructor(settings: KaptionFormLoaderSettings) {
    super('forms', settings)

    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`, `${this.root}/*.ts`])

    this.init({ kaptionFormLoader: this, factorMedia: this.factorMedia }).catch(
      console.error,
    )
  }

  setup() {}

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      kaptionCache: this.kaptionCache,
    }
    return {
      FindOneForm: new FindOneForm(deps),
    } as const
  }

  async loadForm(args: { formId: string, service: FormService }) {
    const { formId, service } = args
    const requestPromise = this.requests.FindOneForm.request({ formId })

    this.activeFormState.value = {
      status: 'loading',
      data: undefined,
      loading: requestPromise,
    }

    const r = await requestPromise

    const loadedForm = {
      ...r,
      data: r.data
        ? new Form({
          ...r.data,
          service,
        })
        : undefined,
    }

    this.activeFormState.value = loadedForm
  }

  async init(service: FormService) {
    if (!this.utils.hasWindow())
      return

    this.utils.vue.watch(
      () => this.factorRouter.current.value,
      async (route) => {
        if (!route)
          return

        const formId = route.params.formId as string | undefined
        if (formId)
          await this.loadForm({ formId, service })
      },
      { immediate: true },
    )
  }
}
