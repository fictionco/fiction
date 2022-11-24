import multer from "multer"
import type { FormData as FormDataNode } from "formdata-node"

import { FactorPlugin, FactorPluginSettings } from "../plugin"
import { FactorDb } from "../plugin-db"
import { FactorServer } from "../plugin-server"
import { FactorUser } from "../plugin-user"
import { FactorAws } from "../plugin-aws"
import { QueryMediaAction, QueryMediaIndex, QuerySaveMedia } from "./queries"
import { QueryUnsplash } from "./query-unsplash"
import { mediaTable } from "./tables"

type FactorMediaSettings = {
  factorUser?: FactorUser
  factorDb?: FactorDb
  factorServer: FactorServer
  factorAws: FactorAws
  bucket: string
  unsplashAccessKey?: string
  cdnUrl?: string
} & FactorPluginSettings

export type UploadConfig = {
  mediaId?: string
  file?: File | Blob
  progress?: () => void
  formData?: FormData | FormDataNode
}

export type MediaConfig = {
  mediaId: string
  url: string
  urlSmall?: string
  blurhash?: string
  width?: number
  height?: number
  size?: number
  alt?: string
  meta?: Record<string, any>
  mime?: string
  userId?: string
}

export class FactorMedia extends FactorPlugin<FactorMediaSettings> {
  imageFieldName = "imageFile"
  tableName = "factor_media"
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  factorServer = this.settings.factorServer
  factorAws = this.settings.factorAws
  bucket = this.settings.bucket
  unsplashAccessKey = this.settings.unsplashAccessKey
  cdnUrl = this.settings.cdnUrl
  public queries = this.createQueries()
  public requests = this.createRequests({
    queries: this.queries,
    basePath: "/media",
    factorServer: this.factorServer,
    factorUser: this.factorUser,
    middleware: () => [multer().single(this.imageFieldName)],
  })

  constructor(settings: FactorMediaSettings) {
    super("media", settings)

    this.factorDb?.addTables([mediaTable])
  }

  async uploadFile(params: UploadConfig) {
    const { file, formData = new FormData(), progress } = params

    if (file) {
      formData.set(this.imageFieldName, file)
    }

    return await this.requests.SaveMedia.upload({ data: formData, progress })
  }

  uploadFiles(params: {
    uploads: UploadConfig[]
    formData?: FormData | FormDataNode
  }) {
    const { uploads } = params
    return Promise.all(
      uploads.map(({ file, progress, mediaId }) =>
        this.uploadFile({ file, progress, mediaId }),
      ),
    )
  }

  createQueries() {
    const deps = {
      factorUser: this.factorUser,
      factorDb: this.factorDb,
      factorMedia: this,
      factorAws: this.factorAws,
    }
    return {
      SaveMedia: new QuerySaveMedia(deps),
      MediaIndex: new QueryMediaIndex(deps),
      MediaAction: new QueryMediaAction(deps),
      Unsplash: new QueryUnsplash(deps),
    } as const
  }
}
