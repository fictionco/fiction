import type { EndpointMeta, EndpointResponse } from '@factor/api'
import type { TableCollectionConfig, TableImageConfig } from '../tables'
import { QueryModel } from './endpoint'

interface ManageCollectionParams {
  _action:
    | 'create'
    | 'update'
    | 'retrieve'
    | 'delete'
    | 'addMedia'
    | 'removeMedia'
  organizationId?: string
  userId?: string
  config?: Partial<TableCollectionConfig>
  imageIds?: string[]
  collectionIds?: string[]
  mediaLimit?: number
  mediaOffset?: number
  message?: string
}
export class QueryManageCollection extends QueryModel {
  async run(
    params: ManageCollectionParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableCollectionConfig>> {
    const { _action, organizationId, userId, config } = params
    const { server } = meta

    if (!_action)
      throw this.stop('_action required')

    const { collectionId, slug } = config || {}

    const db = this.factorDb.client()

    let message: string | undefined = params.message

    let entry: TableCollectionConfig | undefined

    if (_action === 'create' || _action === 'update') {
      if (!organizationId)
        throw this.stop('organizationId required')
      if (!collectionId)
        throw this.stop('collectionId required')

      const inputData: Partial<TableCollectionConfig>
        = this.utils.prepareFields({
          type: _action === 'create' || server ? 'internal' : 'settings',
          fields: config || {},
          table: this.tbl.collection,
          meta,
          factorDb: this.factorDb,
        })

      const nowIso = this.utils.dayjs().toISOString()
      const d = {
        organizationId,
        userId,
        collectionId,
        updatedAt: nowIso,
        ...inputData,
      }

      const query = db
        .table(this.tbl.collection)
        .insert(d)
        .onConflict(`collection_id`)
        .merge(inputData)
        .returning<TableCollectionConfig[]>('*')

      this.log.info('save', { data: { d, _action, organizationId } })
      ;[entry] = await query

      message = 'collection saved'
      return this.run({ ...params, _action: 'retrieve', message }, meta)
    }
    else if (_action === 'delete') {
      const { collectionIds = [] } = params
      if (collectionIds.length === 0)
        throw this.stop('collectionIds required')

      if (!organizationId)
        throw this.stop('organizationId required')
      const deletedCollections = await db
        .delete()
        .from(this.tbl.collection)
        .where({ organizationId })
        .whereIn('collection_id', collectionIds)

      message = `${deletedCollections} collection deleted`
    }
    else if (_action === 'retrieve') {
      const co = this.tbl.collection
      const com = this.tbl.collectionMedia
      const im = this.tbl.image
      const lk = this.tbl.likes
      if (!collectionId && !slug)
        throw this.stop('collectionId or slug required')

      const where = slug
        ? { [`${co}.slug`]: slug }
        : { [`${co}.collection_id`]: collectionId }

      const q = db(co)
        .select([`${co}.*`])
        .where(where)
        .first<TableCollectionConfig | undefined>()

      entry = await q

      if (entry) {
        const select = [
          `${im}.*`,
          db.raw(
            `SUM(CASE WHEN ${lk}.is_liked = true THEN 1 ELSE 0 END) as total_likes`,
          ),
        ]

        if (userId) {
          select.push(
            db.raw(
              `MAX(CASE WHEN ${lk}.user_id = ? THEN CASE WHEN ${lk}.is_liked THEN 1 ELSE 0 END ELSE 0 END) as is_liked`,
              [userId],
            ),
          )
        }

        const q2 = db(im)
          .select<TableImageConfig[]>(select)
          .join(com, `${com}.image_id`, `${im}.image_id`)
          .leftJoin(lk, `${lk}.image_id`, `${im}.image_id`)
          .where({ [`${com}.collection_id`]: entry.collectionId })
          .groupBy(`${im}.image_id`, `${com}.collection_id`)
          .orderBy(`${im}.created_at`, 'desc')
          .limit(params.mediaLimit || 100)
          .offset(params.mediaOffset || 0)

        const media = await q2

        entry.media = media

        const authorId = entry?.userId

        if (authorId) {
          const r = await this.factorUser?.queries.ManageUser.serve(
            {
              _action: 'getPublic',
              userId: authorId,
            },
            { server: true },
          )

          if (r?.status === 'success')
            entry.author = r.data
        }
      }
    }
    else if (_action === 'addMedia') {
      const { imageIds } = params
      const rows = imageIds?.map(imageId => ({ imageId, collectionId }))
      await db(this.tbl.collectionMedia).insert(rows)
      return this.run({ ...params, _action: 'retrieve' }, meta)
    }
    else if (_action === 'removeMedia') {
      const { imageIds = [] } = params
      const del = await db(this.tbl.collectionMedia)
        .delete()
        .where({ collectionId })
        .whereIn('image_id', imageIds)
      return this.run(
        { ...params, _action: 'retrieve', message: `removed ${del} items` },
        meta,
      )
    }

    return { status: 'success', data: entry, message, params }
  }
}
