import sharp from "sharp"
import { Query } from "../query"
import { EndpointResponse } from "../types"

import { EndpointMeta } from "../utils"
import { FactorDb } from "../plugin-db"
import { FactorAws } from "../plugin-aws"
import type { FactorMedia, MediaConfig } from "."

type SaveMediaSettings = {
  factorMedia: FactorMedia
  factorDb?: FactorDb
  factorAws?: FactorAws
}

abstract class MediaQuery extends Query<SaveMediaSettings> {
  factorMedia = this.settings.factorMedia
  factorDb = this.settings.factorDb
  factorAws = this.settings.factorAws
  maxSide = this.utils.isTest() ? 700 : 1600
  constructor(settings: SaveMediaSettings) {
    super(settings)
  }
}

export class QuerySaveMedia extends MediaQuery {
  async run(
    _params: {},
    meta: EndpointMeta,
  ): Promise<EndpointResponse<MediaConfig>> {
    const file = meta.request?.file
    const userId = meta.bearer?.userId

    if (!file) throw this.stop("no file in request")
    if (!userId) throw this.stop("no userId (bearer)")
    if (!this.factorAws) throw this.stop("no factorAws")
    if (!this.factorDb) throw this.stop("no factorDb")
    const mime = file?.mimetype
    const bucket = this.factorMedia.bucket
    const mediaId = this.utils.objectId()
    const filePath = `${userId}/${mediaId}-${file.originalname}`
    const filePathSmall = `${userId}/${mediaId}-${file.originalname}-small`

    const img = await sharp(file.buffer)
      .resize(this.maxSide, this.maxSide, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .toBuffer()

    const smallImg = await sharp(file.buffer)
      .resize(80, 80, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .toBuffer()

    const { url, headObject } = await this.factorAws.uploadS3({
      data: img,
      filePath,
      mime,
      bucket,
    })

    const { url: urlSmall } = await this.factorAws.uploadS3({
      data: smallImg,
      filePath: filePathSmall,
      mime,
      bucket,
    })

    const db = this.factorDb.client()

    const mediaConfig = {
      mediaId,
      url,
      mime: headObject.ContentType || mime,
      bucket,
      userId,
      filePath,
      size: headObject.ContentLength,
      urlSmall,
    }

    const r = await db
      .insert(mediaConfig)
      .into(this.factorMedia.tableName)
      .returning<MediaConfig[]>("*")

    const media = r[0]

    const message = "uploaded successfully"

    return { status: "success", data: media, message }
  }
}

type MediaIndexParams = {
  _action: "list"
  limit?: number
  userId?: string
  url?: string
}

export class QueryMediaIndex extends MediaQuery {
  async run(
    params: MediaIndexParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<MediaConfig[]>> {
    if (!this.factorDb) throw this.stop("no factorDb")
    const { _action } = params

    const userId = params.userId || meta.bearer?.userId

    if (_action !== "list") throw this.stop("invalid action")
    if (!userId) throw this.stop("userId required")

    const db = this.factorDb.client()

    const r = await db
      .select("*")
      .from(this.factorMedia.tableName)
      .where({ userId })

    return { status: "success", data: r, message: "" }
  }
}

type MediaActionParams = {
  _action: "delete"
  url: string
  userId?: string
  deleteStorage?: boolean
}

export class QueryMediaAction extends MediaQuery {
  async run(
    params: MediaActionParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<MediaConfig[]>> {
    if (!this.factorDb) throw this.stop("no factorDb")
    if (!this.factorAws) throw this.stop("no factorAws")
    const { _action, url } = params

    const userId = params.userId || meta.bearer?.userId

    if (!_action) throw this.stop("invalid action")
    if (!userId) throw this.stop("userId required")

    const db = this.factorDb.client()

    const r = await db
      .delete()
      .from(this.factorMedia.tableName)
      .where({ userId, url })
      .returning<MediaConfig[]>("*")

    if (params.deleteStorage) {
      const filePath = new URL(url).pathname.replace(/^\/+/g, "")

      await this.factorAws.deleteS3({
        filePath,
        bucket: this.factorMedia.bucket,
      })
    }

    return { status: "success", data: r, message: "" }
  }
}
