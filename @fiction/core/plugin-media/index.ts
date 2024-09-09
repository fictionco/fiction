import { FormData } from 'formdata-node'
import multer from 'multer'
import { FictionPlugin } from '../plugin.js'
import { EnvVar, vars } from '../plugin-env/index.js'
import { appOrgId } from '../utils/index.js'
import { QueryManageMedia, QueryMediaIndex, QuerySaveMedia } from './queries.js'
import { mediaTable, type TableMediaConfig } from './tables.js'
import { relativeMedia } from './utils.js'
import type { FictionPluginSettings } from '../plugin.js'
import type { FictionAws } from '../plugin-aws/index.js'
import type { FictionDb } from '../plugin-db/index.js'
import type { FictionServer } from '../plugin-server/index.js'
import type { FictionUser } from '../plugin-user/index.js'
import type { EndpointResponse } from '../types/index.js'

export * from './utils.js'
export type { TableMediaConfig }

vars.register(() => [
  new EnvVar({ name: 'UNSPLASH_ACCESS_KEY', isOptional: true }),
])

type FictionMediaSettings = {
  fictionUser: FictionUser
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionAws: FictionAws
  awsBucketMedia: string
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

  cache: Record<string, TableMediaConfig> = {}

  constructor(settings: FictionMediaSettings) {
    super('FictionMedia', settings)

    this.settings.fictionDb?.addTables([mediaTable])

    this.settings.fictionEnv.cleanupCallbacks.push(() => {
      this.cache = {}
    })
  }

  async uploadFile(params: { file?: File, formData?: FormData }): Promise<EndpointResponse<TableMediaConfig>> {
    const { file, formData = new FormData() } = params

    if (file)
      formData.append(this.imageFieldName, file)

    const r = await this.requests.SaveMedia.upload({ data: formData, params: {} })

    return r
  }

  async relativeMedia(args: { url: string, orgId?: string, userId?: string }): Promise<TableMediaConfig> {
    const orgId = args.orgId || appOrgId()
    return relativeMedia({ fictionMedia: this, cache: this.cache, orgId, ...args })
  }
}
