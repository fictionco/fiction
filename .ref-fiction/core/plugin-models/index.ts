import process from 'node:process'
import multer from 'multer'
import type {
  DataFilter,
  EndpointResponse,
  FactorApp,
  FactorAws,
  FactorDb,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
  IndexMeta,
  vue,
} from '@factor/api'
import {
  Endpoint,
  EnvVar,
  FactorPlugin,
  notify,
  vars,
} from '@factor/api'
import type express from 'express'
import type { FactorDashboard } from '../plugin-dashboards'
import type { FactorAdmin } from '../plugin-admin'
import type { FictionInstance } from '../plugin-instance'
import type { FictionJobs } from '../plugin-jobs'
import { tables } from '../tables'
import { MultiImageHandler } from '../ui/image-upload/handler'
import { getRoutes } from './routes'
import type { ObjectType } from './model'
import { Collection, Model, Render, RenderImage } from './model'
import {
  FindOne,
  QueryIndex,
  QueryManageModel,
  QueryManageRender,
  QueryRenders,
  QueryTrainModel,
} from './endpoint'
import {
  QueryListImage,
  QueryManageImage,
  QueryManageLikes,
} from './endpoint-image'
import { QueryManageCollection } from './endpoint-collection'

const replicateTokenKey = 'REPLICATE_API_TOKEN'
vars.register(() => [
  new EnvVar({
    name: replicateTokenKey,
    val: process.env[replicateTokenKey],
  }),
])

const ItemClass = {
  model: Model,
  render: Render,
  image: RenderImage,
  collection: Collection,
}

export type FictionModelSettings = {
  factorDashboard?: FactorDashboard
  factorServer: FactorServer
  factorAws?: FactorAws
  fictionInstance?: FictionInstance
  fictionJobs?: FictionJobs
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  modelBucket?: string
  factorAdmin?: FactorAdmin
} & FactorPluginSettings

export class FictionModel extends FactorPlugin<FictionModelSettings> {
  bucket = this.settings.modelBucket
  factorAdmin = this.settings.factorAdmin
  factorDashboard = this.settings.factorDashboard
  factorServer = this.settings.factorServer
  factorApp = this.settings.factorApp
  factorAws = this.settings.factorAws
  fictionInstance = this.settings.fictionInstance
  fictionJobs = this.settings.fictionJobs
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorRouter = this.settings.factorRouter
  factorEnv = this.settings.factorEnv
  queries = this.createQueries()
  // templates = getTemplates({
  //   factorEnv: this.settings.factorEnv,
  //   fictionModel: this,
  // })
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
    middleware: () => [multer().any()],
  })

  root = this.utils.safeDirname(import.meta.url)
  activeIndexState = this.utils.vue.shallowRef<
    EndpointResponse & {
      model?: Model[] | undefined
      render?: Render[] | undefined
      image?: RenderImage[] | undefined
    }
  >({
    status: 'loading',
  },
  )

  activeIndex<X extends keyof typeof ItemClass>(
    table: X,
  ): vue.ComputedRef<(typeof ItemClass)[X][] | undefined> {
    const r = this.utils.vue.computed(() => {
      return this.activeIndexState?.value[table]
    })

    return r as vue.ComputedRef<(typeof ItemClass)[X][] | undefined>
  }

  activeModelState = this.utils.vue.shallowRef<
    EndpointResponse<Model | undefined>
  >({
    status: 'loading',
    data: undefined,
  },
  )

  activeModel = this.utils.vue.computed<Model | undefined>({
    get: () => {
      return this.activeModelState?.value.data
    },
    set: (v) => {
      if (v) {
        this.activeModelState.value = {
          ...this.activeModelState.value,
          data: v,
        } as EndpointResponse<Model | undefined>
      }
    },
  })

  multiImageHandler = new MultiImageHandler()
  notifyUrl: string
  constructor(settings: FictionModelSettings) {
    super('training', settings)

    this.factorEnv?.addUiPaths([`${this.root}/**/*.vue`, `${this.root}/*.ts`])
    this.factorRouter?.update(getRoutes())

    // if (this.factorDashboard) {
    //   this.factorDashboard.addWidgets(getWidgets())

    //   this.factorDashboard.addToDashboard({
    //     layout: [
    //       { widgetKey: "templateOverview" },
    //       { widgetKey: "modelOverview" },
    //       { widgetKey: "renderOverview" },
    //     ],
    //     dashboardId: "home",
    //   })
    // }

    this.factorDb.addTables(tables)

    const notifyEndpoint = new Endpoint({
      requestHandler: (...r) => this.handleCompleteNotification(...r),
      key: 'trainingNotify',
      basePath: '/notify-model',
      serverUrl: this.factorServer.serverUrl.value,
      factorUser: this.factorUser,
      useNaked: true,
    })

    this.notifyUrl = notifyEndpoint.requestUrl

    this.factorServer.addEndpoints([notifyEndpoint])

    if (this.utils.hasWindow())
      this.watchLoader().catch(console.error)

    // this.factorAdmin?.hooks.push({
    //   hook: "menus",
    //   callback: (menus) => {
    //     menus.primary.push("modelIndex")
    //     return menus
    //   },
    // })

    // if (this.factorRouter) {
    //   this.factorAdmin?.orgMenu.value.push({
    //     menu: [
    //       this.factorRouter?.getRouteMenuItem("modelIndex"),
    //       this.factorRouter?.getRouteMenuItem("renderCreate", {
    //         replace: { modelId: "" },
    //       }),
    //       this.factorRouter?.getRouteMenuItem("collectionIndex"),
    //     ],
    //   })
    // }
  }

  async handleCompleteNotification(
    req: express.Request,
    _res: express.Response,
  ) {
    const _query = req.query as Record<string, string>
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      factorAws: this.factorAws,
      fictionInstance: this.fictionInstance,
      fictionJobs: this.fictionJobs,
      fictionModel: this,
      factorRouter: this.factorRouter,
    }
    return {
      ManageModel: new QueryManageModel(deps),
      ManageRender: new QueryManageRender(deps),
      ItemIndex: new QueryIndex(deps),
      TrainModel: new QueryTrainModel(deps),
      QueryRenders: new QueryRenders(deps),
      FindOne: new FindOne(deps),
      ManageLikes: new QueryManageLikes(deps),
      ManageImage: new QueryManageImage(deps),
      ManageCollection: new QueryManageCollection(deps),
      ListImage: new QueryListImage(deps),
    } as const
  }

  async findOne<T extends keyof typeof ItemClass>(args: {
    id: string
    table: T
  }): Promise<ObjectType<T> | undefined> {
    const { table } = args
    const r = await this.requests.FindOne.projectRequest(args)

    return r.data
      ? (new ItemClass[table]({
          fictionModel: this,
          ...r.data,
        }) as ObjectType<T>)
      : undefined
  }

  async requestIndex<T extends keyof typeof ItemClass>(args: {
    table: T
    limit?: number
    offset?: number
    filters?: DataFilter[]
    imageId?: string
  }): Promise<{ items: ObjectType<T>[] | undefined, indexMeta?: IndexMeta }> {
    const { table, limit = 10, offset = 0, imageId } = args

    const r = await this.requests.ItemIndex.projectRequest({
      _action: 'list',
      table,
      limit,
      offset,
      imageId,
    })

    const items = r.data
      ? (r.data.map(
          d => new ItemClass[table]({ ...d, fictionModel: this }),
        ) as ObjectType<T>[])
      : undefined

    return { items, indexMeta: r.indexMeta }
  }

  async load(modelId: string | null) {
    if (modelId) {
      const requestPromise = this.requests.ManageModel.projectRequest({
        _action: 'retrieve',
        modelConfig: { modelId },
      })

      this.activeModelState.value = {
        status: 'loading',
        data: undefined,
        loading: requestPromise,
      }

      const r = await requestPromise

      const loaded = {
        ...r,
        data: r.data ? new Model({ ...r.data, fictionModel: this }) : undefined,
      }

      this.activeModelState.value = loaded

      return loaded.data
    }
    else {
      const data = new Model({ fictionModel: this })
      this.activeModelState.value = {
        status: 'success',
        data: new Model({ fictionModel: this }),
        loading: false,
      }

      return data
    }
  }

  async uploadRequest(args: {
    model: Model
    _action: 'save' | 'train'
    trainingHandling?: 'createNew' | 'retrain'
    isQueued?: boolean
  }) {
    const {
      model,
      _action,
      trainingHandling = 'retrain',
      isQueued = false,
    } = args

    const organizationId = this.factorUser.activeOrganizationId.value

    if (!organizationId)
      throw new Error('no organization')

    const formData = new FormData()
    formData.set('_action', _action)
    formData.set('queueMode', isQueued ? 'on' : '')
    formData.set('organizationId', organizationId)

    // set zip files
    const _promises = model.fullConceptsList.value.map(async (c) => {
      const zipFileInstanceData = await c.instanceImageHandler.renderImages()
      formData.set(`zip-instance-${c.conceptId}`, zipFileInstanceData)
    })

    await Promise.all(_promises)

    if (trainingHandling === 'createNew') {
      const newModelId = this.utils.objectId({ prefix: 'mo' })
      model.modelId.value = newModelId
    }

    formData.set('modelConfig', JSON.stringify(model.toConfig()))

    const r = await this.requests.TrainModel.upload({ data: formData })

    if (r?.message)
      notify.emit(r.status as 'success' | 'error', r.message)

    return r
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

        const modelId = route.params.modelId as string | undefined
        if (modelId)
          await this.load(modelId)
      },
      { immediate: true },
    )
  }

  async bulkEdit(params: {
    _action: 'delete'
    selectedIds: string[]
    table: 'model' | 'render' | 'image' | 'collection'
  }) {
    await this.requests.ItemIndex.projectRequest(params)
  }
}
