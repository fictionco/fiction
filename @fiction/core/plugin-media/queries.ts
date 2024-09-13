import type { Buffer } from 'node:buffer'
import type sharp from 'sharp'
import type { FictionAws } from '../plugin-aws/index.js'
import type { FictionDb } from '../plugin-db/index.js'
import type { DataFilter, EndpointResponse, IndexQuery } from '../types/index.js'
import type { CropSettings, EndpointMeta } from '../utils/index.js'
import type { FictionMedia, TableMediaConfig } from './index.js'
import path from 'node:path'
import fs from 'fs-extra'
import { Query } from '../query.js'
import { abort } from '../utils/error.js'
import { objectId } from '../utils/id.js'
import { createImageVariants, getFileExtensionFromFetchResponse, getMimeType, hashFile } from '../utils/media.js'
import { getNodeBuffer } from '../utils/nodeUtils.js'
import { safeDirname } from '../utils/utils.js'
import { isTest } from '../utils/vars.js'
import { t } from './tables.js'

interface SaveMediaSettings {
  fictionMedia: FictionMedia
  fictionDb: FictionDb
  fictionAws: FictionAws
  maxFileSize?: number
  supportedMimeTypes?: string[]
}

abstract class MediaQuery extends Query<SaveMediaSettings> {
  db = () => this.settings.fictionDb?.client()
  maxSide = isTest() ? 700 : 1600
  maxFileSize = this.settings.maxFileSize || 10 * 1024 * 1024 // 10MB

  supportedMimeTypes = new Set(this.settings.supportedMimeTypes || [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Videos
    'video/mp4',
    'video/webm',
  ])

  constructor(settings: SaveMediaSettings) {
    super(settings)
  }

  async createBlurHash(
    img: sharp.Sharp,
    meta: sharp.OutputInfo,
  ): Promise<string | undefined> {
    /**
     * NOTE: that the raw img data removes the size/meta data
     * thats why its passed in above
     */
    const alphaImg = img.raw().ensureAlpha()
    const pixelBuffer = await alphaImg.toBuffer()

    const { width, height } = meta || {}

    if (!width || !height) {
      this.log.warn('could not create blurhash (no meta info)')
      return
    }

    const bh = await import('blurhash')

    const blurhash = bh.encode(new Uint8ClampedArray(pixelBuffer), width, height, 4, 4)

    if (bh.isBlurhashValid(blurhash))
      return blurhash
  }

  async createMediaFromUrl(args: {
    orgId?: string
    userId?: string
    fields?: TableMediaConfig
    storageGroupPath?: string
  }, meta: EndpointMeta): Promise<TableMediaConfig | undefined> {
    const { orgId, userId, fields, storageGroupPath } = args

    const Buffer = getNodeBuffer()
    const { sourceImageUrl } = fields || {}

    if (!sourceImageUrl)
      throw new Error('No sourceImageUrl provided')

    // Fetch the image from the URL
    const response = await fetch(sourceImageUrl)
    if (!response.ok)
      throw new Error(`Failed to fetch image from URL: ${sourceImageUrl}`)

    // Convert the response to a buffer
    const arrayBuffer = await response.arrayBuffer()
    const b = Buffer.from(arrayBuffer)

    // Create a temporary file to simulate a file upload
    const extension = await getFileExtensionFromFetchResponse(response)
    const fileName = `${objectId()}${extension}`
    const tempFilePath = path.join(safeDirname(import.meta.url), fileName)
    fs.writeFileSync(tempFilePath, b)

    try {
      // Call the existing createAndSaveMedia function with the simulated file
      const result = await this.createAndSaveMedia({
        filePath: tempFilePath,
        orgId,
        userId,
        fields,
        storageGroupPath,

      }, meta)

      return result
    }
    catch (_e) {
      return undefined
    }
    finally {
      fs.unlinkSync(tempFilePath)
    }
  }

  async saveReferenceToDb(mediaConfig: Partial<TableMediaConfig>, meta: EndpointMeta) {
    const { userId, orgId } = mediaConfig

    const prepped = this.settings.fictionDb.prep({ type: 'insert', fields: mediaConfig, table: t.media, meta })

    const ins = { userId, orgId, ...prepped }

    const [insertedMedia] = await this.db().insert(ins).table(t.media).onConflict(['hash', 'org_id']).merge().returning<TableMediaConfig[]>('*')

    return insertedMedia
  }

  private cleanAndLimitFileName(fileName: string, maxLength: number = 70): string {
    const ext = path.extname(fileName)
    const nameWithoutExt = path.basename(fileName, ext)
    const cleanName = nameWithoutExt.replace(/[^a-z0-9-]/gi, '')
    const limitedName = cleanName.slice(0, maxLength - ext.length)
    return limitedName + ext
  }

  async getMediaMetadata(buffer: Buffer, mime: string): Promise<{ width?: number, height?: number, duration?: number }> {
    const { default: ffprobe } = await import('ffprobe')
    const { default: ffprobeStatic } = await import('ffprobe-static')
    if (mime.startsWith('video/')) {
      try {
        const tempFilePath = `/tmp/${objectId()}.${mime.split('/')[1]}`
        await fs.promises.writeFile(tempFilePath, buffer)
        const info = await ffprobe(tempFilePath, { path: ffprobeStatic.path })
        await fs.promises.unlink(tempFilePath)

        const videoStream = info.streams.find(s => s.codec_type === 'video')
        return {
          width: videoStream?.width,
          height: videoStream?.height,
          duration: videoStream?.duration ? Number.parseFloat(videoStream.duration) : undefined,
        }
      }
      catch (error) {
        console.error('Error extracting video metadata:', error)
        return {}
      }
    }
    return {}
  }

  async createAndSaveMedia(args: {
    file?: Express.Multer.File
    filePath?: string
    fields?: TableMediaConfig
    orgId?: string
    userId?: string
    storageKeyPath?: string
    storageGroupPath?: string
    crop?: CropSettings
    hash?: string
  }, meta: EndpointMeta): Promise<TableMediaConfig> {
    const cdnUrl = this.settings.fictionMedia.settings.cdnUrl
    const bucket = this.settings.fictionMedia.settings.awsBucketMedia
    const maxSide = this.maxSide
    const fictionAws = this.settings.fictionAws

    const { file, filePath: sourceFilePath, orgId, userId, fields, storageGroupPath = orgId, storageKeyPath, crop } = args
    const fileSource = file?.buffer || (sourceFilePath && fs.readFileSync(sourceFilePath))
    const originalFileName = file?.originalname || (sourceFilePath && path.basename(sourceFilePath))

    if (!fileSource || !originalFileName) {
      throw new Error('No file provided')
    }

    const cleanFileName = this.cleanAndLimitFileName(originalFileName)
    const baseFileName = path.parse(cleanFileName).name

    // Add this check for file size
    if (fileSource.length > this.maxFileSize) {
      throw abort(`File size exceeds limit of ${this.maxFileSize / (1024 * 1024)}MB`, { expected: meta.expectError })
    }

    const fileMime = getMimeType(cleanFileName, file?.mimetype)

    if (!this.supportedMimeTypes.has(fileMime)) {
      throw abort(`Unsupported file type: ${fileMime}`, { expected: meta.expectError })
    }

    const mediaId = objectId({ prefix: 'med' })
    const basePath = `${storageGroupPath}/${mediaId}`
    const filePath = storageKeyPath || `${basePath}-${cleanFileName}`
    const thumbFilePath = `${basePath}-thumb-${baseFileName}.png`
    const rasterFilePath = `${basePath}-raster-${baseFileName}.png`

    this.log.info('creating media', { data: { filePath, bucket } })

    const sizeOptions = { main: { width: maxSide, height: maxSide }, thumbnail: { width: 80, height: 80 }, crop } as const
    const r = await createImageVariants({ fileSource, sizeOptions, fileMime })

    const { mainBuffer, thumbnailBuffer, metadata, blurhash, rasterBuffer } = r

    const hash = args.hash || await hashFile({ filePath: sourceFilePath, buffer: file?.buffer, settings: { crop } })

    try {
      const uploadPromises = [
        fictionAws.uploadS3({ data: mainBuffer, filePath, mime: fileMime, bucket }),
        thumbnailBuffer && fictionAws.uploadS3({ data: thumbnailBuffer, filePath: thumbFilePath, mime: 'image/png', bucket }),
        rasterBuffer && fictionAws.uploadS3({ data: rasterBuffer, filePath: rasterFilePath, mime: 'image/png', bucket }),
      ]

      const [mainData, thumbData] = await Promise.all(uploadPromises)

      this.log.info('media uploaded')

      const baseUrl = mainData?.url

      const searchParams = new URLSearchParams({ blurhash: blurhash || '' }).toString()
      const constructUrl = (base: string | undefined, path: string): string => `${base ? new URL(path, base).toString() : baseUrl}?${searchParams}`

      const originUrl = `${baseUrl}?${searchParams}`
      const thumbOriginUrl = `${thumbData?.url || baseUrl}?${searchParams}`
      const url = constructUrl(cdnUrl, filePath)
      const thumbUrl = constructUrl(cdnUrl, thumbFilePath)

      const { ContentLength: size, ContentType: mime = fileMime } = mainData?.headObject || {}
      const imageMetadata = metadata || {}

      const mediaMetadata = await this.getMediaMetadata(mainBuffer, fileMime)
      const { width, height, duration, orientation } = { ...imageMetadata, ...mediaMetadata }

      const mediaConfig: Partial<TableMediaConfig> = {
        ...fields,
        orgId,
        userId,
        mediaId,
        hash,
        blurhash,
        originUrl,
        url,
        thumbOriginUrl,
        thumbUrl,
        mime,
        bucket,
        filePath,
        size,
        width,
        height,
        orientation,
        duration,
      }

      const insertedMedia = await this.saveReferenceToDb(mediaConfig, meta)

      return insertedMedia
    }
    catch (e) {
      const error = e as Error
      this.log.error('Error uploading media', { error })
      throw abort(`Failed to upload media: ${error.message}`, { expected: meta.expectError })
    }
  }
}

export class QuerySaveMedia extends MediaQuery {
  async run(
    _params: Record<string, unknown>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableMediaConfig>> {
    // created by multer
    const file = meta.request?.file
    const userId = meta.request?.body.userId
    const orgId = meta.request?.body.orgId

    if (!file)
      throw abort('no file provided to endpoint by request')
    if (!userId || !orgId)
      throw abort('no userId or orgId')

    const media = await this.createAndSaveMedia({ file, userId, orgId }, meta)

    const message = 'uploaded successfully'

    return { status: 'success', data: media, message }
  }
}

interface MediaIndexParams {
  _action: 'list'
  limit?: number
  userId?: string
  url?: string
}

export class QueryMediaIndex extends MediaQuery {
  async run(
    params: MediaIndexParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { _action } = params

    const userId = params.userId || meta.bearer?.userId

    if (_action !== 'list')
      throw abort('invalid action')
    if (!userId)
      throw abort('userId required')

    const r = await this.db()
      .select('*')
      .from(t.media)
      .where({ userId })

    return { status: 'success', data: r, message: '' }
  }
}

type WhereMedia = { mediaId?: string, orgId?: string, url?: string, hash?: string }

type MediaCreate = {
  fields: Partial<TableMediaConfig>
  storageKeyPath?: string
  storageGroupPath?: string
  crop?: CropSettings
  noCache?: boolean
}

export type ManageMediaRequest =
  | { _action: 'create', orgId: string, userId?: string } & MediaCreate
  | { _action: 'createFromUrl', orgId: string, userId?: string, fields: { sourceImageUrl: string } & Partial<TableMediaConfig> } & MediaCreate
  | { _action: 'checkAndCreate', orgId: string, userId?: string } & MediaCreate
  | { _action: 'list', orgId: string, where?: Partial<TableMediaConfig>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', orgId: string, filters?: DataFilter[] }
  | { _action: 'update', orgId: string, where: WhereMedia[], fields: Partial<TableMediaConfig> }
  | { _action: 'delete', orgId: string, where: WhereMedia[] }
  | { _action: 'retrieve', orgId: string, where: WhereMedia }

export type MediaParams = ManageMediaRequest & IndexQuery
export class QueryManageMedia extends MediaQuery {
  limit = 40
  offset = 0

  async run(params: MediaParams, meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { _action, orgId } = params

    if (!orgId)
      throw abort('orgId required')

    let r: EndpointResponse<TableMediaConfig[]>
    switch (_action) {
      case 'createFromUrl':
        r = await this.handleCreateFromUrl(params, meta)
        break
      case 'checkAndCreate':
        r = await this.handleCheckAndCreate(params, meta)
        break
      case 'retrieve':
        r = await this.handleRetrieve(params, meta)
        break
      case 'delete':
        r = await this.handleDelete(params, meta)
        break
      case 'list':
        r = await this.handleList(params, meta)
        break
      case 'count':
        r = { status: 'success', data: [] } // added in addIndexMeta
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return this.addIndexMeta(params, r, meta)
  }

  private async addIndexMeta(params: MediaParams, r: EndpointResponse<TableMediaConfig[]>, _meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { orgId, limit = this.limit, offset = this.offset, filters = [] } = params

    const q = this.db().table(t.media).where({ orgId }).count().first<{ count: string }>()

    if (filters.length) {
      filters.forEach((filter) => {
        void q.andWhere(filter.field, filter.operator, filter.value)
      })
    }

    const { count } = await q

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    return r
  }

  async handleCreateFromUrl(params: MediaParams & { _action: 'createFromUrl' }, meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig[]>> {
    if (params._action !== 'createFromUrl')
      throw abort('Invalid action')

    const { orgId, userId, fields, storageGroupPath } = params
    const media = await this.createMediaFromUrl({ orgId, userId, fields, storageGroupPath }, meta)

    if (!media)
      return { status: 'error', data: undefined }

    return { status: 'success', data: [media] }
  }

  async handleCheckAndCreate(params: MediaParams & { _action: 'checkAndCreate' }, meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { fields, noCache, crop, orgId, userId, storageKeyPath, storageGroupPath } = params

    if (!fields?.filePath)
      throw abort('File path is required for checkAndCreate action.', { expected: meta.expectError })

    const hash = await hashFile({ filePath: fields.filePath, settings: { crop } })

    if (!noCache) {
      const [existingMedia] = await this.db().select('*').from(t.media).where({ hash })

      if (existingMedia) {
        existingMedia.isCached = true
        return { status: 'success', data: [existingMedia] }
      }
    }

    const media = await this.createAndSaveMedia({ filePath: fields.filePath, hash, orgId, userId, fields, storageKeyPath, storageGroupPath, crop }, meta)
    return { status: 'success', data: [media] }
  }

  async handleRetrieve(params: MediaParams & { _action: 'retrieve' }, meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { orgId, where } = params

    if (!where)
      throw abort('Fields are required for retrieve action.', { expected: meta.expectError })

    const { url, mediaId, hash } = where

    const queryConditions = { orgId, ...(url && { url }), ...(mediaId && { mediaId }), ...(hash && { hash }) }

    const media = await this.db().select().from(t.media).where(queryConditions)

    return { status: 'success', data: media }
  }

  async handleDelete(params: MediaParams & { _action: 'delete' }, meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { orgId, where } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const results: TableMediaConfig[] = []
    for (const condition of where) {
      const result = await this.db().table(t.media).where({ orgId, ...condition }).delete().returning('*')
      results.push(...result)

      if (result.length > 0 && result[0].url) {
        const filePath = new URL(result[0].url).pathname.replace(/^\/+/g, '')
        const bucket = this.settings.fictionMedia.settings.awsBucketMedia
        this.log.info(`deleting media file: ${filePath}`, { data: { filePath, bucket } })
        await this.settings.fictionAws.deleteS3({ filePath, bucket })
      }
    }

    return { status: 'success', message: `${results.length} Media items deleted`, data: results, indexMeta: { changedCount: results.length } }
  }

  async handleList(params: MediaParams & { _action: 'list' }, _meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { where, orgId, limit = this.limit, offset = this.offset, page, filters = [] } = params

    let effectiveOffset = offset
    if (page && page > 0) {
      effectiveOffset = (page - 1) * limit
    }

    let query = this.db().select('*').from(t.media).where({ orgId, ...where })

    if (filters.length) {
      filters.forEach((filter) => {
        query = query.andWhere(filter.field, filter.operator, filter.value)
      })
    }

    const media = await query.limit(limit).offset(effectiveOffset).orderBy('createdAt', 'desc')

    return { status: 'success', data: media }
  }
}
