import type {
  DataFilter,
  EndpointMeta,
  EndpointResponse,
  FactorAws,
  FactorDb,
  FactorRouter,
  FactorUser,
  IndexMeta,
  ProgressStatus,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import JSZip from 'jszip'
import type { FictionModel } from '..'
import type { FictionJobs } from '../plugin-jobs'
import type { FictionInstance } from '../plugin-instance'
import type {
  RenderConfig,
  TableImageConfig,
  TableJobConfig,
  TableModelConfig,
  TableRenderConfig,
} from '../tables'
import type { ConceptConfig } from '../plugin-app-dreambooth/types'
import type { ObjectTypeConfig } from './model'
import { Model, baseModels } from './model'
import { getDimensions } from './util'

interface ModelQuerySettings {
  factorUser?: FactorUser
  factorDb: FactorDb
  factorAws?: FactorAws
  fictionInstance?: FictionInstance
  fictionModel: FictionModel
  fictionJobs?: FictionJobs
  factorRouter?: FactorRouter
}

export abstract class QueryModel extends Query<ModelQuerySettings> {
  fictionModel = this.settings.fictionModel
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  factorAws = this.settings.factorAws
  fictionInstance = this.settings.fictionInstance
  fictionJobs = this.settings.fictionJobs
  factorRouter = this.settings.factorRouter

  constructor(settings: ModelQuerySettings) {
    super(settings)
  }

  async deleteModelsS3(args: {
    organizationId: string
    modelIds: string[]
  }): Promise<void> {
    const { organizationId, modelIds } = args
    const bucket = this.fictionModel.bucket
    const aws = this.factorAws
    if (!bucket)
      throw this.stop('No bucket defined')
    if (!aws)
      throw this.stop('No AWS defined')
    const p = modelIds.map(async (modelId) => {
      await aws.deleteDirectory({
        directory: `${organizationId}/models/${modelId}/`,
        bucket,
      })
    })

    await Promise.all(p)
  }
}

interface BulkEditParams {
  organizationId: string
  _action?: 'delete'
  selectedIds?: string[]
}

export class QueryBulkEdit extends QueryModel {
  async run(
    params: BulkEditParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<number>> {
    const { organizationId, _action = 'delete', selectedIds = [] } = params

    const db = this.factorDb.client()
    let message = ''
    let data = 0

    if (
      _action === 'delete'
      && selectedIds.length
      && this.utils.hasAccessLevel('editor', meta)
    ) {
      data = await db
        .delete()
        .table(this.tbl.model)
        .whereIn('modelId', selectedIds)
        .where({ organizationId })

      // track deleted model
      await db.batchInsert(
        this.tbl.deleted,
        selectedIds.map((id) => {
          return { modelId: id, organizationId, deletedType: 'model' }
        }),
      )

      await this.deleteModelsS3({
        organizationId,
        modelIds: selectedIds,
      })

      message = `${data} deleted`
    }

    return { status: 'success', data, message }
  }
}

type FormListParams<T> = {
  organizationId: string
  _action?: 'list' | 'delete'
  table?: T
  selectedIds?: string[]
  imageId?: string
  filters?: DataFilter[]
} & IndexMeta

export class QueryIndex<
  T extends 'model' | 'render' | 'image' | 'collection',
> extends QueryModel {
  async run(
    params: FormListParams<T>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<ObjectTypeConfig<T>[]>> {
    const {
      organizationId,
      _action = 'list',
      limit = 20,
      offset = 0,
      selectedIds = [],
      table = 'model',
      imageId,
      filters = [],
    } = params
    if (!organizationId)
      throw this.stop('organizationId required')

    const db = this.factorDb.client()
    let message = ''

    const currentTable = this.tbl[table]
    const idKey = `${table}Id`

    if (
      _action === 'delete'
      && selectedIds.length
      && this.utils.hasAccessLevel('editor', meta)
    ) {
      const num = await db
        .delete()
        .table(currentTable)
        .whereIn(idKey, selectedIds)

      await this.deleteModelsS3({
        organizationId,
        modelIds: selectedIds,
      })

      // track deleted model
      await db.batchInsert(
        this.tbl.deleted,
        selectedIds.map((id) => {
          return { [idKey]: id, organizationId, deletedType: table }
        }),
      )

      message = `${num} deleted`
    }

    const base = db
      .select([
        `${currentTable}.*`,
        db.raw(`row_to_json(factor_user.*) as author`),
      ])
      .from(currentTable)
      .where(`${currentTable}.organization_id`, organizationId)
      .limit(limit)
      .offset(offset)
      .orderBy('updatedAt', 'desc')
      .leftJoin(
        'factor_user',
        `factor_user.user_id`,
        `=`,
        `${currentTable}.user_id`,
      )

    if (table === 'render' || table === 'image') {
      void base
        .join(
          this.tbl.model,
          `${this.tbl.model}.model_id`,
          `=`,
          `${currentTable}.model_id`,
        )
        .select([db.raw(`row_to_json(${this.tbl.model}.*) as model`)])
    }
    else if (table === 'collection' && imageId) {
      void base.select([
        db.raw(
          `EXISTS (
              SELECT 1
              FROM ${this.tbl.collectionMedia}
              WHERE ${this.tbl.collectionMedia}.collection_id = ${this.tbl.collection}.collection_id
              AND ${this.tbl.collectionMedia}.image_id = ?
            ) AS has_media_item`,
          [imageId],
        ),
      ])
    }

    if (filters.length) {
      filters.forEach((filter) => {
        const { field, operator, value } = filter
        if (field && operator && value)
          void base.where(field, operator, value)
      })
    }

    const rows = await base

    const r = await db
      .count<{ count: string }>('*')
      .from(currentTable)
      .where({ organizationId })
      .first()

    const count = +(r?.count || 0)

    return {
      status: 'success',
      data: rows as ObjectTypeConfig<T>[],
      indexMeta: { count, limit, offset },
      message,
    }
  }
}

export class FindOne<
  T extends 'model' | 'render' | 'image' | 'collection',
> extends QueryModel {
  async run(
    params: { table: T, id: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<ObjectTypeConfig<T>>> {
    const { id, table } = params

    if (!id)
      throw this.stop('modelId required to get model')

    const idKey = `${params.table}Id`

    const db = this.factorDb.client()

    const r = await db
      .table(this.tbl[table])
      .select('*')
      .where(idKey, id)
      .first<ObjectTypeConfig<T>>()

    return { status: 'success', data: r as ObjectTypeConfig<T> }
  }
}

interface ManageModelParams {
  _action: 'upsert' | 'retrieve' | 'delete'
  organizationId?: string
  userId?: string
  modelConfig: Partial<TableModelConfig>
  renderLimit?: number
  renderOffset?: number
}
export class QueryManageModel extends QueryModel {
  prepFields(
    _type: 'settings',
    config: Partial<TableModelConfig>,
    _meta?: EndpointMeta,
  ): Partial<TableModelConfig> {
    if (!this.factorDb)
      throw this.stop('no db')

    const cols = this.factorDb.getColumns(this.tbl.model)

    const out: Record<string, unknown> = {}

    cols?.forEach((col) => {
      const k = col.key as keyof TableModelConfig
      const val = config[k]
      if (col.isSetting && val !== undefined)
        out[k] = val
    })

    return out
  }

  async run(
    params: ManageModelParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableModelConfig>> {
    if (!params._action)
      throw this.stop('_action required')

    const { _action, organizationId, modelConfig, userId } = params

    const { modelId } = modelConfig
    const nowIso = this.utils.dayjs().toISOString()

    if (!modelId)
      throw this.stop({ message: 'modelId required' })

    const db = this.factorDb.client()

    let modelEntry: TableModelConfig | undefined
    let message: string | undefined

    const templateData: TableModelConfig | undefined = undefined

    const modelData: Partial<TableModelConfig> = this.utils.prepareFields({
      type: 'internal',
      fields: { organizationId, userId, ...modelConfig },
      table: this.tbl.model,
      meta,
      factorDb: this.factorDb,
    })

    this.log.info('modelData', {
      data: { templateData, modelData },
    })
    if (_action === 'upsert' && this.utils.hasAccessLevel('editor', meta)) {
      if (!organizationId)
        throw this.stop('organizationId required')

      modelData.updatedAt = nowIso

      const query = db
        .table(this.tbl.model)
        .insert(modelData)
        .onConflict(`model_id`)
        .merge(modelData)
        .returning<TableModelConfig[]>('*')

      ;[modelEntry] = await query

      message = 'model saved'
    }
    else if (
      _action === 'delete'
      && this.utils.hasAccessLevel('editor', meta)
    ) {
      if (!organizationId)
        throw this.stop('organizationId required')

      // track deleted model
      await db
        .insert({ organizationId, modelId, deletedType: 'model' })
        .table(this.tbl.deleted)

      // delete model from db
      ;[modelEntry] = await db
        .delete()
        .from(this.tbl.model)
        .where({ organizationId, modelId })
        .limit(1)
        .returning<TableModelConfig[]>('*')

      // Delete model directory
      await this.deleteModelsS3({
        organizationId,
        modelIds: [modelId],
      })

      message = 'model deleted'
    }
    else if (_action === 'retrieve') {
      if (!modelId)
        throw this.stop('modelId required')

      const { renderLimit = 40, renderOffset = 0 } = params

      const model = await db(this.tbl.model)
        .where({ modelId })
        .first<TableModelConfig | undefined>()

      const renders = await db(this.tbl.render)
        .where({ modelId, status: 'ready' })
        .limit(renderLimit)
        .offset(renderOffset)
        .orderBy('createdAt', 'desc')
        .select<TableRenderConfig[]>()

      // Attach images to their respective renders
      for (const render of renders) {
        render.images = await db(this.tbl.image)
          .where({ renderId: render.renderId })
          .select<TableImageConfig[]>()
      }

      if (model) {
        // Attach renders to the model object
        model.renders = renders
        if (renders.length > 0) {
          const lastConfig = renders[0]?.renderConfig || {}
          delete lastConfig.seed // don't reuse the seed
          // model.renderConfig = lastConfig
        }
      }

      modelEntry = model
    }

    return { status: 'success', data: modelEntry, message, params }
  }
}

export class QueryTrainModel extends QueryModel {
  async run(
    params: {
      _action: 'save' | 'train'
      modelConfig: string
      organizationId: string
      queueMode?: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableModelConfig>> {
    const mime = 'application/zip'
    const bucket = this.fictionModel.bucket
    const files = meta.request?.files
    const userId = meta.bearer?.userId
    if (!bucket)
      throw this.stop('no bucket')
    if (!files || !Array.isArray(files))
      throw this.stop('no files in request')
    if (!userId)
      throw this.stop('no userId (bearer)')

    this.utils.hasAccessLevel('editor', meta)

    const aws = this.factorAws
    if (!aws)
      throw this.stop('no factorAws')
    if (!this.factorDb)
      throw this.stop('no factorDb')
    const nowIso = this.utils.dayjs().toISOString()
    const { organizationId, _action, queueMode = '' } = params

    if (!organizationId)
      throw this.stop('organizationId required')

    const isQueued = queueMode === 'on'

    if (isQueued) {
      await this.fictionInstance?.startServer({
        organizationId,
        organizationName: `${meta.bearer?.email}:Queue`,
        idleTimeoutMinutes: 10,
        userId,
      })
    }

    const modelConfig: TableModelConfig = params.modelConfig
      ? JSON.parse(params.modelConfig)
      : undefined

    if (!modelConfig.modelName)
      throw this.stop('no model name')

    const model = new Model({ ...modelConfig, fictionModel: this.fictionModel })

    if (!model.modelId)
      throw this.stop('no modelId')
    if (!this.fictionJobs || !this.fictionInstance)
      throw this.stop('no fictionJobs or fictionInstances')

    const _promises = model.fullConceptsList.value.map(
      async (c): Promise<ConceptConfig> => {
        const classDataZipName = `zip-class-${c.conceptId}`
        const classDataFilePath = `${model.s3Root.value}/${classDataZipName}.zip`
        const instanceDataZipName = `zip-instance-${c.conceptId}`
        const instanceFilePath = `${model.s3Root.value}/${instanceDataZipName}.zip`

        const instanceDataFile = files.find(
          file => file.fieldname === instanceDataZipName,
        )

        if (!instanceDataFile) {
          throw this.stop({
            message: `instance data missing for ${c.conceptId}`,
            data: {
              fileNames: files.map(f => f.fieldname),
              instanceDataZipName,
              modelConfig,
            },
          })
        }

        const classDataFile = files.find(
          file => file.fieldname === classDataZipName,
        )

        let classDataZipUrl = c.classDataZipUrl.value
        let classDataFileSize

        if (classDataFile) {
          const [
            { url: resultClassDataZipUrl, headObject: classDataHeadObject },
          ] = await Promise.all([
            aws.uploadS3({
              data: classDataFile.buffer,
              filePath: classDataFilePath,
              mime,
              bucket,
            }),
          ])
          classDataZipUrl = resultClassDataZipUrl
          classDataFileSize = classDataHeadObject.ContentLength || 0
        }

        const zipper = await JSZip.loadAsync(instanceDataFile.buffer)
        const fileArray = Object.values(zipper.files) || []
        const [{ url: instanceDataZipUrl, headObject }, ...rest]
          = await Promise.all([
            aws.uploadS3({
              data: instanceDataFile.buffer,
              filePath: instanceFilePath,
              mime,
              bucket,
            }),
            ...fileArray.slice(0, 3).map(async (file) => {
              const p = `${model.s3Root.value}/img/${file.name}`
              return await aws.uploadS3({
                data: await file.async('nodebuffer'),
                filePath: p,
                mime: 'image/jpeg',
                bucket,
              })
            }),
          ])

        return {
          ...c.toConfig(),
          instanceDataZipUrl,
          classDataZipUrl,
          meta: {
            sampleImageUrls: rest?.length > 0 ? rest.map(r => r.url) : [],
            instanceDataFileSize: headObject.ContentLength || 0,
            classDataFileSize,
          },
        }
      },
    )

    const conceptsList = await Promise.all(_promises)

    const conf: Partial<TableModelConfig> = {
      ...model.toConfig(),
      conceptsList,
      updatedAt: nowIso,
      organizationId,
      userId,
      meta: {
        sampleImageUrls: conceptsList.flatMap(
          c => c.meta?.sampleImageUrls || [],
        ),
      },
    }

    if (_action === 'train') {
      conf.status = 'requested'
      conf.requestedAt = nowIso
    }

    let message = 'model saved'
    let jobEntry: TableJobConfig | undefined

    let modelResult = await this.fictionModel.queries.ManageModel.serve(
      { _action: 'upsert', modelConfig: conf, organizationId },
      meta,
    )

    if (_action === 'train') {
      const url = this.factorRouter?.url('modelTrain', {
        modelId: model.modelId.value,
      }).value
      const jobConfig: Partial<TableJobConfig> = {
        organizationId,
        inputs: conf,
        jobType: 'train',
        progressId: model.modelId.value,
        processor: 'aim',
        userId,
        modelId: model.modelId.value,
        title: `training model ${model.modelName.value}`,
        isQueued,
        url,
        notifyMode: 'full',
      } as const

      try {
        // queue original job
        const r = await this.fictionJobs.queries.ManageJobs.serve(
          { _action: 'create', jobConfig },
          { server: true },
        )

        if (r.status === 'error' || !r.data) {
          message = r.message || 'error creating job'
        }
        else {
          jobEntry = await this.fictionInstance.instanceJobRequest({
            jobConfig: r.data,
          })

          message = 'model saved and training requested'
        }
      }
      catch (error) {
        const e = error as Error
        modelResult = await this.fictionModel.queries.ManageModel.serve(
          {
            _action: 'upsert',
            modelConfig: {
              status: 'error',
              statusDetails: { message: e.message, trace: e.stack },
            },
            organizationId,
          },
          meta,
        )
        throw error
      }
    }

    const dbEntryResult = modelResult.data

    return {
      status: 'success',
      data: dbEntryResult,
      message,
      jobEntry,
    }
  }
}

export class QueryRenders extends QueryModel {
  async run(
    params: {
      modelId?: string
      organizationId: string
      limit?: number
      offset?: number
      filters?: DataFilter[]
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableRenderConfig[]>> {
    const userId = meta.bearer?.userId

    if (!userId)
      throw this.stop('no userId (bearer)')
    if (!this.factorDb)
      throw this.stop('no factorDb')

    const db = this.factorDb.client()

    const {
      modelId,
      organizationId,
      limit = 100,
      offset = 0,
      filters = [],
    } = params

    const im = this.tbl.image
    const re = this.tbl.render
    const lk = this.tbl.likes
    const i2 = `render_images`

    const subQueryLikes = db.select('*').from(lk).where({ userId }).as('likes')
    const subQueryImages = db
      .select(
        db.raw(
          `json_agg(
            to_jsonb(${im}) ||
            jsonb_build_object(
              'is_liked', likes.is_liked
            )
          ) as images`,
        ),
        `${im}.render_id`,
      )
      .from(re)
      .join(im, `${im}.render_id`, `=`, `${re}.render_id`)
      .leftJoin(subQueryLikes, `likes.image_id`, `=`, `${im}.image_id`)
      .where({ [`${re}.status`]: 'ready' })
      .groupBy(`${im}.render_id`)
      .as(i2)

    let query = db(re)
      .select(['images', `${re}.*`])
      .from(re)
      .leftJoin(subQueryImages, `${i2}.render_id`, `=`, `${re}.render_id`)
      .where({ organizationId })
      .limit(limit)
      .offset(offset)
      .orderBy('createdAt', 'desc')

    if (modelId)
      query = query.where({ modelId })

    if (filters.length) {
      filters.forEach((filter) => {
        const { field, operator, value } = filter
        if (field && operator && value)
          query = query.where(field, operator, value)
      })
    }

    const renders = await query

    return { status: 'success', data: renders }
  }
}

export class QueryManageRender extends QueryModel {
  async run(
    params: {
      _action: 'delete' | 'create'
      renderConfig: Partial<RenderConfig>
      status?: ProgressStatus
      modelId?: string
      userId?: string
      organizationId: string
      isQueued?: boolean
    },
    meta: EndpointMeta,
  ): Promise<
    EndpointResponse<TableRenderConfig> & {
      jobConfig: TableJobConfig | undefined
    }
  > {
    if (!params._action)
      throw this.stop('_action required')

    const { _action, organizationId, renderConfig, isQueued = false } = params

    const { renderId } = renderConfig

    const db = this.factorDb.client()

    let renderEntry: TableRenderConfig | undefined
    let jobEntry: TableJobConfig | undefined
    let message: string | undefined
    let fields = {}
    if (_action === 'delete') {
      if (!organizationId)
        throw this.stop('organizationId required')

      const images = await db
        .select<TableImageConfig[]>('*')
        .from(this.tbl.image)
        .where({ organizationId, renderId })

      const imageIds = images.map(i => i.imageId)

      // track deleted images
      await db.batchInsert(
        this.tbl.deleted,
        imageIds.map((id) => {
          return { imageId: id, organizationId, deletedType: 'image' }
        }),
      )
      ;[renderEntry] = await db
        .delete()
        .from(this.tbl.render)
        .where({ organizationId, renderId })
        .limit(1)
        .returning<TableRenderConfig[]>('*')

      // track deleted render
      await db
        .insert({ organizationId, renderId, deletedType: 'render' })
        .table(this.tbl.deleted)

      message = 'render deleted'
    }
    else if (_action === 'create') {
      const { modelId, organizationId, userId, status = 'requested' } = params

      if (!modelId)
        throw this.stop('no modelId')
      if (!organizationId)
        throw this.stop('no organizationId')
      if (!this.factorDb)
        throw this.stop('no factorDb')
      if (!this.fictionInstance)
        throw this.stop('no fictionInstance')
      if (!this.fictionJobs)
        throw this.stop('no fictionJobs')

      const serverIsReady = await this.fictionInstance.serverIsReady(
        organizationId,
      )
      if (!serverIsReady)
        throw this.stop('Server is off. Turn it on?')

      let realModelId: string | undefined = modelId
      let baseModel: string | undefined
      if (modelId.includes('base_')) {
        realModelId = undefined
        const baseModelKey = modelId.replace('base_', '')
        const m = baseModels(this.fictionModel).find(
          b => b.key === baseModelKey,
        )

        baseModel = m?.baseModel.value

        if (!baseModel)
          throw this.stop(`baseModel not found from modelId: ${modelId}`)
      }

      const { width, height } = getDimensions(
        params.renderConfig.aspect || 'square',
      )
      const nowIso = this.utils.dayjs().toISOString()

      const renderConfig = {
        numInferenceSteps: 90,
        guidanceScale: 8.5,
        numOutputs: 2,
        negativePrompt: 'ugly, deformed, disgusting',
        ...params.renderConfig,
        width,
        height,
      }

      const inputs: Partial<TableRenderConfig> = {
        status,
        baseModel,
        modelId: realModelId,
        userId,
        organizationId,
        renderId: this.utils.objectId({ prefix: 're' }),
        requestedAt: nowIso,
        renderConfig,
      }

      const url = this.factorRouter?.url('renderCreate', {
        modelId: realModelId,
      }).value

      const jobConfig: Partial<TableJobConfig> = {
        organizationId,
        userId,
        inputs,
        jobType: 'render',
        isQueued,
        renderId: inputs.renderId,
        processor: 'aim',
        modelId: realModelId,
        baseModel,
        title: `generate images (${renderConfig.numOutputs})`,
        status,
        url,
        notifyMode: 'contextual',
      }

      /**
       * MUST COME FIRST
       * renderId is required, if it fails, we have to update to error state
       */

      fields = this.utils.prepareFields({
        type: 'internal',
        fields: inputs,
        table: this.tbl.render,
        meta,
        factorDb: this.factorDb,
      })

      const query = db
        .table(this.fictionModel.tbl.render)
        .insert(fields)
        .returning<TableRenderConfig[]>('*')

      const renderResult = await query
      renderEntry = renderResult[0]

      // queue original job
      const r = await this.fictionJobs.queries.ManageJobs.serve(
        { _action: 'create', jobConfig },
        { server: true },
      )

      if (!r.data)
        throw new Error('no job data')

      jobEntry = await this.fictionInstance.instanceJobRequest({
        jobConfig: r.data,
      })
    }

    return {
      status: 'success',
      data: renderEntry,
      message,
      params,
      fields,
      jobConfig: jobEntry,
    }
  }
}
