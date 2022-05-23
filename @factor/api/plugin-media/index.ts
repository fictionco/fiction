import multer from "multer"
import { FactorPlugin } from "../plugin"
import { FactorDb } from "../plugin-db"
import { FactorServer } from "../plugin-server"
import { FactorUser } from "../plugin-user"
import { FactorAws } from "../plugin-aws"
import { QueryMediaAction, QueryMediaIndex, QuerySaveMedia } from "./queries"
import { QueryUnsplash } from "./query-unsplash"
import { mediaTable } from "./tables"

type FactorMediaSettings = {
  factorUser: FactorUser
  factorDb: FactorDb
  factorServer: FactorServer
  factorAws: FactorAws
  bucket: string
  unsplashAccessKey?: string
}

export type MediaConfig = {
  mediaId: string
  url: string
  width?: number
  height?: number
  size?: number
  alt?: string
  meta?: Record<string, any>
  mime?: string
}

export class FactorMedia extends FactorPlugin<FactorMediaSettings> {
  imageFieldName = "image"
  tableName = "factor_media"
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  factorServer = this.settings.factorServer
  factorAws = this.settings.factorAws

  bucket = this.settings.bucket
  unsplashAccessKey = this.settings.unsplashAccessKey
  public queries = this.createQueries()
  public requests = this.createRequests({
    queries: this.queries,
    basePath: "/media",
    factorServer: this.factorServer,
    factorUser: this.factorUser,
    middleware: [multer().single(this.imageFieldName)],
  })

  constructor(settings: FactorMediaSettings) {
    super(settings)

    this.factorDb.addTable(mediaTable)
  }
  setup() {}

  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append(this.imageFieldName, file)

    return await this.requests.SaveMedia.upload(formData)
  }

  uploadFiles(files: FileList) {
    return Promise.all([...files].map((file) => this.uploadFile(file)))
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
