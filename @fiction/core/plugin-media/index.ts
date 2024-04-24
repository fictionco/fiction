import multer from 'multer'
import { FormData } from 'formdata-node'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import type { FictionDb } from '../plugin-db'
import type { FictionServer } from '../plugin-server'
import type { FictionUser } from '../plugin-user'
import type { FictionAws } from '../plugin-aws'
import { EnvVar, vars } from '../plugin-env'
import type { EndpointResponse } from '../types'
import { QueryManageMedia, QueryMediaIndex, QuerySaveMedia } from './queries'
import { type TableMediaConfig, mediaTable } from './tables'

export * from './utils'
export type { TableMediaConfig }

vars.register(() => [
  new EnvVar({ name: 'UNSPLASH_ACCESS_KEY', isOptional: true }),
])

type FictionMediaSettings = {
  fictionUser?: FictionUser
  fictionDb?: FictionDb
  fictionServer: FictionServer
  fictionAws: FictionAws
  bucket: string
  unsplashAccessKey?: string
  cdnUrl?: string
} & FictionPluginSettings

export interface UploadConfig {
  mediaId?: string
  file?: File | Blob
  progress?: () => void
  formData?: FormData
}

export class FictionMedia extends FictionPlugin<FictionMediaSettings> {
  imageFieldName = 'imageFile'
  tableName = 'fiction_media'
  bucket = this.settings.bucket
  unsplashAccessKey = this.settings.unsplashAccessKey
  cdnUrl = this.settings.cdnUrl
  queries = {
    SaveMedia: new QuerySaveMedia({ fictionMedia: this, ...this.settings }),
    MediaIndex: new QueryMediaIndex({ fictionMedia: this, ...this.settings }),
    ManageMedia: new QueryManageMedia({ fictionMedia: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/media',
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
    middleware: () => [multer().single(this.imageFieldName)],
  })

  constructor(settings: FictionMediaSettings) {
    super('FictionMedia', settings)

    this.settings.fictionDb?.addTables([mediaTable])
  }

  async uploadFile(params: { file?: File, formData?: FormData }): Promise<EndpointResponse<TableMediaConfig>> {
    const { file, formData = new FormData() } = params

    if (file)
      formData.append(this.imageFieldName, file)

    const r = await this.requests.SaveMedia.upload({ data: formData })

    return r
  }
}
