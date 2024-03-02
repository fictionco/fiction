import type { DataFilter, EndpointMeta, EndpointResponse } from '@factor/api'
import type { TableImageConfig, TableLikeConfig, TableModelConfig } from '../tables'
import { QueryModel } from './endpoint'

interface ManageImageParams {
  _action: 'create' | 'update' | 'retrieve' | 'delete'
  organizationId?: string
  userId?: string
  imageConfig?: Partial<TableImageConfig>
  message?: string
}

interface ListImageParams {
  _action: 'list'
  organizationId?: string
  userId?: string
  limit?: number
  offset?: number
  filters?: DataFilter[]
}

export class QueryListImage extends QueryModel {
  async run(
    params: ListImageParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableImageConfig[]>> {
    const { _action, organizationId } = params
    if (!_action)
      throw this.stop('_action required')

    const db = this.factorDb.client()

    let imageEntries: TableImageConfig[] | undefined

    if (_action === 'list') {
      const { limit = 40, offset = 0, filters = [] } = params
      const base = db
        .select<TableImageConfig[]>([
          `${this.tbl.image}.*`,
          db.raw(`row_to_json(factor_user.*) as author`),
        ])
        .from(this.tbl.image)
        .whereNotNull('url')
        .limit(limit)
        .offset(offset)
        .orderBy('updatedAt', 'desc')
        .leftJoin(
          'factor_user',
          `factor_user.user_id`,
          `=`,
          `${this.tbl.image}.user_id`,
        )

      if (organizationId)
        void base.where(`${this.tbl.image}.organization_id`, organizationId)

      if (filters.length) {
        filters.forEach((filter) => {
          const { field, operator, value } = filter
          if (field && operator && value)
            void base.where(field, operator, value)
        })
      }

      imageEntries = await base
    }
    else {
      throw this.stop('invalid _action')
    }

    return { status: 'success', data: imageEntries, params }
  }
}
export class QueryManageImage extends QueryModel {
  async deleteImagesS3(args: {
    organizationId: string
    filePaths: string[]
  }): Promise<void> {
    const { filePaths } = args
    const bucket = this.fictionModel.bucket
    if (!bucket)
      throw this.stop('bucket not configured')
    const aws = this.factorAws
    if (!aws)
      throw this.stop('AWS not configured')

    const p = filePaths.map(async (filePath) => {
      await aws.deleteS3({ filePath, bucket })
    })

    await Promise.all(p)
  }

  async run(
    params: ManageImageParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableImageConfig>> {
    const { _action, organizationId, userId, imageConfig } = params
    const { server } = meta
    let { message } = params

    if (!_action)
      throw this.stop('_action required')

    const { imageId } = imageConfig || {}

    const db = this.factorDb.client()

    let imageEntry: TableImageConfig | undefined

    if (_action === 'create' || _action === 'update') {
      if (!organizationId)
        throw this.stop('organizationId required')

      const imageData: Partial<TableModelConfig> = this.utils.prepareFields({
        type: _action === 'create' || server ? 'internal' : 'settings',
        fields: { organizationId, userId, ...imageConfig },
        table: this.tbl.image,
        meta,
        factorDb: this.factorDb,
      })

      const d = { imageId, organizationId, userId, ...imageData }

      const query = db
        .table(this.tbl.image)
        .insert(d)
        .onConflict(`image_id`)
        .merge(d)
        .returning<TableImageConfig[]>('*')

      ;[imageEntry] = await query

      message = message || 'image saved'
    }
    else if (_action === 'delete') {
      if (!imageId)
        throw this.stop('imageId required')
      if (!organizationId)
        throw this.stop('organizationId required')
      ;[imageEntry] = await db
        .delete()
        .from(this.tbl.image)
        .where({ organizationId, imageId })
        .limit(1)
        .returning<TableImageConfig[]>('*')

      // track deleted image
      await db
        .insert({ organizationId, imageId, deletedType: 'image' })
        .table(this.tbl.deleted)

      message = 'image deleted'
    }
    else if (_action === 'retrieve') {
      const im = this.tbl.image
      const lk = this.tbl.likes
      if (!imageId)
        throw this.stop('imageId required')

      const q = db(im)
        .select([`${im}.*`])
        .where({ [`${im}.image_id`]: imageId })
        .first<TableImageConfig | undefined>()

      imageEntry = await q

      if (!imageEntry)
        throw this.stop('image not found')

      const { isLiked } = userId
        ? await db
          .select('*')
          .from(lk)
          .where({ imageId, userId })
          .first<{ isLiked: boolean }>()
        : { isLiked: false }

      imageEntry.isLiked = isLiked

      const imageAuthorId = imageEntry?.userId

      if (imageAuthorId) {
        const r = await this.factorUser?.queries.ManageUser.serve(
          {
            _action: 'getPublic',
            userId: imageAuthorId,
          },
          { server: true },
        )

        if (r?.status === 'success')
          imageEntry.author = r.data
      }
    }
    else {
      throw this.stop('invalid _action')
    }

    return { status: 'success', data: imageEntry, message, params }
  }
}

interface ManageLikesParams {
  _action: 'like' | 'unlike'
  userId: string
  imageId: string
}
export class QueryManageLikes extends QueryModel {
  async run(
    params: ManageLikesParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableLikeConfig>> {
    const { _action, userId, imageId } = params

    if (!_action)
      throw this.stop('_action required')

    const db = this.factorDb.client()

    const message: string | undefined = undefined

    const isLiked = _action === 'like'
    const data = { userId, imageId, isLiked }
    const query = db
      .table(this.tbl.likes)
      .insert(data)
      .onConflict([`image_id`, `user_id`])
      .merge(data)
      .returning<TableLikeConfig[]>('*')

    const [entry] = await query

    return { status: 'success', data: entry, message, params }
  }
}
