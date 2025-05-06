import type express from 'express'
import type { FictionAws } from '../plugin-aws/index.js'
import type { FictionDb } from '../plugin-db/index.js'
import type { FictionServer } from '../plugin-server/index.js'
import type { FictionUser } from '../plugin-user/index.js'
import type { FictionPluginSettings } from '../plugin.js'
import type { EndpointResponse } from '../types/index.js'
import type { TableMediaConfig } from './tables.js'
import { FormData } from 'formdata-node'
import multer from 'multer'
import { EnvVar, vars } from '../plugin-env/index.js'
import { log } from '../plugin-log/index.js'
import { FictionPlugin } from '../plugin.js'
import { QueryManageMedia, QueryMediaIndex, QuerySaveMedia } from './queries.js'
import { mediaTable } from './tables.js'

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

// Create a debug middleware to inspect the request before and after multer
function debugMulter(args: { fieldName: string, debug?: boolean }) {
  const { fieldName, debug = false } = args
  const logger = log.contextLogger('debugMulter')

  const pre = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info('Pre-multer request state:', {
      data: {
        contentType: req.headers['content-type'],
        hasBody: !!req.body,
        bodyType: typeof req.body,
        bodyKeys: Object.keys(req.body || {}),
        isMultipart: req.headers['content-type']?.includes('multipart/form-data'),
        boundary: req.headers['content-type']?.split('boundary=')[1],
      },
    })
    next()
  }

  const post = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info('Post-multer request state:', {
      data: {
        hasFile: !!req.file,
        fileFields: req.file ? Object.keys(req.file) : [],
        bodyFields: Object.keys(req.body || {}),
        fileDetails: req.file
          ? {
              fieldname: req.file.fieldname,
              originalname: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
            }
          : null,
      },
    })
    next()
  }

  const multerMiddleware = multer({ storage: multer.memoryStorage(), limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  } }).single(fieldName)

  if (debug) {
    return [pre, multerMiddleware, post]
  }
  else {
    return [multerMiddleware]
  }
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
    middleware: () => debugMulter({ fieldName: this.imageFieldName }),
  })

  cache: Record<string, TableMediaConfig> = {}

  constructor(settings: FictionMediaSettings) {
    super('FictionMedia', settings)

    this.settings.fictionDb?.addTables([mediaTable])

    this.settings.fictionEnv.cleanupCallbacks.push(() => {
      this.cache = {}
    })
  }

  async uploadFile(params: { file?: File, formData?: FormData, caller: string }): Promise<EndpointResponse<TableMediaConfig>> {
    const { file, formData = new FormData(), caller = 'unknown' } = params

    if (file)
      formData.append(this.imageFieldName, file)

    const r = await this.requests.SaveMedia.upload({ data: formData, params: { caller } })

    return r
  }
}
