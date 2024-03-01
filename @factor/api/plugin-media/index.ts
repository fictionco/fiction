import multer from 'multer'
import { FormData } from 'formdata-node'
import type { FactorPluginSettings } from '../plugin'
import { FactorPlugin } from '../plugin'
import type { FactorDb } from '../plugin-db'
import type { FactorServer } from '../plugin-server'
import type { FactorUser } from '../plugin-user'
import type { FactorAws } from '../plugin-aws'
import { EnvVar, vars } from '../plugin-env'
import type { EndpointResponse } from '../types'
import { QueryManageMedia, QueryMediaIndex, QuerySaveMedia } from './queries'
import { type TableMediaConfig, mediaTable } from './tables'

export * from './utils'
export { TableMediaConfig }

vars.register(() => [
  new EnvVar({ name: 'UNSPLASH_ACCESS_KEY', isOptional: true }),
])

type FactorMediaSettings = {
  factorUser?: FactorUser
  factorDb?: FactorDb
  factorServer: FactorServer
  factorAws: FactorAws
  bucket: string
  unsplashAccessKey?: string
  cdnUrl?: string
} & FactorPluginSettings

export interface UploadConfig {
  mediaId?: string
  file?: File | Blob
  progress?: () => void
  formData?: FormData
}

export class FactorMedia extends FactorPlugin<FactorMediaSettings> {
  imageFieldName = 'imageFile'
  tableName = 'factor_media'
  bucket = this.settings.bucket
  unsplashAccessKey = this.settings.unsplashAccessKey
  cdnUrl = this.settings.cdnUrl
  queries = {
    SaveMedia: new QuerySaveMedia({ factorMedia: this, ...this.settings }),
    MediaIndex: new QueryMediaIndex({ factorMedia: this, ...this.settings }),
    ManageMedia: new QueryManageMedia({ factorMedia: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/media',
    factorServer: this.settings.factorServer,
    factorUser: this.settings.factorUser,
    middleware: () => [multer().single(this.imageFieldName)],
  })

  constructor(settings: FactorMediaSettings) {
    super('FactorMedia', settings)

    this.settings.factorDb?.addTables([mediaTable])
  }

  async uploadFile(params: { file?: File, formData?: FormData }): Promise<EndpointResponse<TableMediaConfig>> {
    const { file, formData = new FormData() } = params

    if (file)
      formData.append(this.imageFieldName, file)

    const r = await this.requests.SaveMedia.upload({ data: formData })

    return r
  }
}
