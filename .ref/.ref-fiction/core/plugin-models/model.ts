// @unocss-include
import { FactorObject, vue } from '@factor/api'
import type {
  TableCollectionConfig,
  TableImageConfig,
  TableModelConfig,
  TableRenderConfig,
} from '../tables'
import { Concept } from '../plugin-app-dreambooth/concept'
import type { FictionModel } from '.'

export interface ModelMeta {
  fileSize: number
  mime: string
  imageCount: number
}

export type ModelSettings = {
  fictionModel: FictionModel
  key?: string
} & Partial<TableModelConfig>

export type RenderSettings = {
  fictionModel: FictionModel
} & Partial<TableRenderConfig>

export type ImageSettings = {
  fictionModel: FictionModel
} & Partial<TableImageConfig>

export type CollectionSettings = {
  fictionModel: FictionModel
} & Partial<TableCollectionConfig>

export type ObjectTypeConfig<T> = T extends 'model'
  ? TableModelConfig
  : T extends 'render'
    ? TableRenderConfig
    : T extends 'image'
      ? TableImageConfig
      : T extends 'collection'
        ? TableCollectionConfig
        : never

export type ObjectType<T> = T extends 'model'
  ? Model
  : T extends 'render'
    ? Render
    : T extends 'image'
      ? RenderImage
      : T extends 'collection'
        ? Collection
        : never

export class RenderImage extends FactorObject<ImageSettings> {
  status = this.settings.status
  organizationId = this.settings.organizationId || ''
  userId = this.settings.userId
  renderId = this.settings.renderId
  imageId = this.settings.imageId || this.utils.objectId()
  fictionModel = this.settings.fictionModel
  meta = this.settings.meta || {}
  isLiked = vue.ref(this.settings.isLiked || false)
  url = this.settings.url
  width = this.settings.width
  height = this.settings.height
  alt = this.settings.alt
  title = this.settings.title
  description = this.settings.description
  mimetype = this.settings.mimetype
  author = this.settings.author
  createdAt = this.settings.createdAt
  pageUrl = vue.computed(() => {
    const appUrl = 'https://www.fiction.com'
    return `${appUrl}/media/${this.imageId}`
  })

  blurhash = this.settings.blurhash
  showcaseStatus = vue.ref(this.settings.showcaseStatus)
  aspect = this.settings.aspect
  constructor(settings: ImageSettings) {
    super('RenderImage', settings)
  }

  toConfig(): Partial<TableImageConfig> {
    const conf = {
      blurhash: this.blurhash,
      status: this.status,
      imageId: this.imageId,
      userId: this.userId,
      renderId: this.renderId,
      organizationId: this.organizationId,
      meta: this.meta,
      isLiked: this.isLiked.value,
      url: this.url,
      width: this.width,
      height: this.height,
      aspect: this.aspect,
      alt: this.alt,
      title: this.title,
      description: this.description,
      mimetype: this.mimetype,
      author: this.author,
      createdAt: this.createdAt,
      showcaseStatus: this.showcaseStatus.value,
    }

    return conf
  }
}

export class Collection extends FactorObject<CollectionSettings> {
  fictionModel = this.settings.fictionModel
  organizationId = this.settings.organizationId || ''
  userId = this.settings.userId
  title = vue.ref(this.settings.title)
  description = vue.ref(this.settings.description)
  slug = vue.ref(this.settings.slug)
  collectionId
    = this.settings.collectionId || this.utils.objectId({ prefix: 'coll' })

  updatedAt = this.settings.updatedAt
  createdAt = this.settings.createdAt
  media = vue.shallowRef(this.settings.media || [])
  mediaFull = vue.computed(() => {
    return this.media.value.map(
      r => new RenderImage({ ...r, fictionModel: this.fictionModel }),
    )
  })

  author = this.settings.author
  isPrivate = vue.ref(this.settings.isPrivate || false)
  hasMediaItem = vue.ref(this.settings.hasMediaItem || false)
  url = vue.computed(() => {
    const appUrl = 'https://www.fiction.com'
    return `${appUrl}/collection/${this.slug.value}`
  })

  constructor(settings: CollectionSettings) {
    super('Collection', settings)
  }

  toConfig(): Partial<TableCollectionConfig> {
    const conf = {
      title: this.title.value,
      description: this.description.value,
      collectionId: this.collectionId,
      userId: this.userId,
      organizationId: this.organizationId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      slug: this.slug.value,
      isPrivate: this.isPrivate.value,
      hasMediaItem: this.hasMediaItem.value,
      author: this.author,
      media: this.mediaFull.value.map(im => im.toConfig()),
    }

    return conf
  }
}

export class Render extends FactorObject<RenderSettings> {
  modelId = this.settings.modelId
  renderId = this.settings.renderId || this.utils.objectId()
  renderName = vue.ref(this.settings.renderName)
  organizationId = this.settings.organizationId || ''
  fictionModel = this.settings.fictionModel
  renderConfig = vue.ref(this.settings.renderConfig || {})
  images = vue.shallowRef(this.settings.images || [])
  imagesFull = vue.computed(() => {
    return this.images.value.map(
      r => new RenderImage({ ...r, fictionModel: this.fictionModel }),
    )
  })

  meta = this.settings.meta || {}
  isLiked = vue.ref(this.settings.isLiked || false)
  author = this.settings.author
  userId = this.settings.userId
  status = vue.ref(this.settings.status)
  updatedAt = this.settings.updatedAt
  createdAt = this.settings.createdAt
  showDetails = vue.ref(false)
  constructor(settings: RenderSettings) {
    super('render', settings)
  }

  toConfig(): Partial<TableRenderConfig> {
    const conf = {
      organizationId: this.organizationId,
      renderId: this.renderId,
      meta: this.meta,
      isLiked: this.isLiked.value,
      renderConfig: this.renderConfig.value,
    }

    return conf
  }
}

export type ModelImageSettings = {
  fictionModel: FictionModel
} & Partial<TableRenderConfig>

export class Model extends FactorObject<ModelSettings> {
  fictionModel = this.settings.fictionModel
  key = this.settings.key
  modelId = vue.ref(this.settings.modelId)
  modelName = vue.ref(this.settings.modelName || '')
  description = vue.ref(this.settings.description)
  organizationId = this.settings.organizationId || ''
  templateConfig = vue.ref(this.settings.templateConfig || {})
  meta = vue.ref(this.settings.meta || {})
  templateId = vue.ref(this.settings.templateId || 'dreambooth')

  conceptsList = vue.ref(this.settings.conceptsList || [])
  fullConceptsList = vue.computed(() => {
    const c = this.conceptsList.value

    if (c.length === 0)
      c?.push({})

    const concepts = c.map(c => new Concept({ model: this, ...c }))
    return concepts
  })

  baseModel = vue.ref(this.settings.baseModel || '')
  status = vue.ref(this.settings.status || 'pending')
  sampleImageUrls = vue.computed(() => this.meta.value.sampleImageUrls || [])

  userId = this.settings.userId
  author = this.settings.author
  updatedAt = this.settings.updatedAt
  createdAt = this.settings.createdAt
  requestedAt = this.settings.requestedAt
  completedAt = this.settings.completedAt
  startedAt = this.settings.startedAt
  thumbUrl = vue.ref(this.settings.thumbUrl)
  modelCheckpointPath = vue.ref(this.settings.modelCheckpointPath)
  modelDiffusersPath = vue.ref(this.settings.modelDiffusersPath)
  modelVersion = vue.ref(this.settings.modelVersion)
  renders = vue.ref(this.settings.renders || [])
  statusDetails = vue.ref(this.settings.statusDetails || {})
  fullRenders = vue.computed(() => {
    return this.renders.value.map((r) => {
      this.log.info('render', { data: r })
      return new Render({ ...r, fictionModel: this.fictionModel })
    })
  })

  isTraining = vue.computed(() => {
    return ['loading', 'requested', 'processing', 'saving'].includes(
      this.status.value,
    )
  })

  s3Root = vue.computed(
    () => `${this.organizationId}/models/${this.modelId.value}`,
  )

  constructor(settings: ModelSettings) {
    super('Model', settings)
  }

  updateModel(config: Partial<TableModelConfig>) {
    const entries = Object.entries(config)
    entries.forEach(([key, value]) => {
      const k = key as keyof TableModelConfig
      const v = value
      const t = this as unknown as Record<keyof TableModelConfig, vue.Ref>
      if (v !== undefined && t[k] && vue.isRef(t[k]))
        t[k].value = v
    })
  }

  toConfig(): Partial<TableModelConfig> {
    return {
      organizationId: this.organizationId,
      modelId: this.modelId.value,
      modelName: this.modelName.value || '',
      description: this.description.value || '',
      status: this.status.value,
      templateConfig: this.templateConfig.value,
      conceptsList: this.fullConceptsList.value.map(c => c.toConfig()),
      templateId: this.templateId.value,
      thumbUrl: this.thumbUrl?.value || '',
      baseModel: this.baseModel.value,
      meta: this.meta.value || {},
    }
  }

  async save() {
    const modelConfig = this.toConfig()

    if (!modelConfig)
      throw new Error('no modelConfig')

    const r = await this.fictionModel.requests.ManageModel.projectRequest({
      _action: 'upsert',
      modelConfig,
    })

    return r
  }
}

export function baseModels(fictionModel: FictionModel) {
  return [
    new Model({
      fictionModel,
      key: 'sd',
      modelName: 'Stable Diffusion 1.5',
      modelId: 'base_sd',
      baseModel: 'runwayml/stable-diffusion-v1-5',
      status: 'ready',
    }),
  ]
}
