import type { FactorServer, ServiceConfig } from '@factor/api'
import { FactorPlugin } from '@factor/api'
import type { CloudFront, Invalidation } from '@aws-sdk/client-cloudfront'
import type {
  GetObjectCommandOutput,
  PutObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3'

type KaptionAwsSettings =
  | {
    context: 'api'
    awsAccessKey: string
    awsAccessKeySecret: string
    awsS3BucketRegion: string
  }
  | { context: 'app', apiServer: FactorServer }

type S3FileOutput = GetObjectCommandOutput & {
  key: string
  data?: string
}

export class KaptionAws extends FactorPlugin<KaptionAwsSettings> {
  awsAccessKey!: string
  awsAccessKeySecret!: string
  awsS3BucketRegion!: string
  cloudFront?: CloudFront
  s3?: S3
  apiServer?: FactorServer
  constructor(settings: KaptionAwsSettings) {
    super(settings)

    if (settings.context === 'app') {
      this.apiServer = settings.apiServer
    }
    else {
      const { awsAccessKey, awsAccessKeySecret } = settings

      if (!awsAccessKey || !awsAccessKeySecret) {
        this.log.error(
          'could not create aws client, missing awsAccessKey or awsAccessKeySecret',
        )
        return
      }

      this.awsAccessKey = settings.awsAccessKey
      this.awsAccessKeySecret = settings.awsAccessKeySecret
      this.awsS3BucketRegion = settings.awsS3BucketRegion
    }
  }

  setup = (): ServiceConfig => {
    return {
      name: this.constructor.name,
      paths: [this.utils.safeDirname(import.meta.url)],
    }
  }

  getCloudFront = async (): Promise<CloudFront> => {
    if (!this.cloudFront) {
      const { CloudFront } = await import('@aws-sdk/client-cloudfront')
      this.cloudFront = new CloudFront({
        apiVersion: '2020-05-31',
        region: this.awsS3BucketRegion,
        credentials: {
          accessKeyId: this.awsAccessKey,
          secretAccessKey: this.awsAccessKeySecret,
        },
      })
    }
    return this.cloudFront
  }

  getS3 = async (): Promise<S3> => {
    if (!this.s3) {
      const { S3 } = await import('@aws-sdk/client-s3')
      this.s3 = new S3({
        apiVersion: '2006-03-01',
        region: this.awsS3BucketRegion,
        credentials: {
          accessKeyId: this.awsAccessKey,
          secretAccessKey: this.awsAccessKeySecret,
        },
      })
    }
    return this.s3
  }

  bustCdnCache = async (options: {
    paths: string[]
    distributionId: string
  }): Promise<Invalidation | undefined> => {
    const { distributionId, paths } = options
    const cf = await this.getCloudFront()
    const r = await cf.createInvalidation({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: this.utils.objectId(),
        Paths: {
          Items: paths,
          Quantity: paths.length, // ???
        },
      },
    })

    return r.Invalidation
  }

  /**
   * Upload to s3
   * @remarks
   *  - access control: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
   */
  uploadS3 = async ({
    name,
    bucket,
    mime,
    data,
    accessControl = 'public-read',
  }: {
    name: string
    bucket?: string
    mime: 'text/javascript' | 'application/json' | 'text/html' | 'text/css'
    data: Buffer | string
    accessControl?: 'public-read' | 'private'
  }): Promise<PutObjectCommandOutput> => {
    if (!bucket)
      throw new Error('no bucket set')
    const s3 = await this.getS3()
    return await s3.putObject({
      Body: data,
      Bucket: bucket,
      Key: name,
      ContentType: mime,
      ACL: accessControl,
    })
  }

  /**
   * Download a file from s3
   */
  downloadS3 = async ({
    key,
    bucket,
    returnString,
  }: {
    key: string
    bucket?: string
    returnString?: boolean
  }): Promise<S3FileOutput> => {
    if (!bucket)
      throw new Error('no bucket set')
    const s3 = await this.getS3()
    const result = await s3.getObject({
      Bucket: bucket,
      Key: key,
    })

    const kb = (result.ContentLength ?? 0) / 1000

    this.log.info(`downloading ${key}: ${kb}kb`)

    const out: S3FileOutput = { ...result, key }

    if (returnString) {
      out.data = await this.streamToString(
        result?.Body as NodeJS.ReadableStream,
      )
    }

    return out
  }

  /**
   * Request head to see if file exists
   * https://github.com/andrewrk/node-s3-client/issues/88#issuecomment-158134766
   */
  fileExistsS3 = async ({
    name,
    bucket,
  }: {
    name: string
    bucket: string
  }): Promise<boolean> => {
    if (!bucket)
      throw new Error('no bucket set')
    try {
      const s3 = await this.getS3()
      await s3.headObject({ Bucket: bucket, Key: name })
      return true
    }
    catch {
      return false
    }
  }

  streamToString = async (stream?: NodeJS.ReadableStream): Promise<string> => {
    if (!stream)
      return ''
    const chunks: Uint8Array[] = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
      stream.on('error', (err: Error) => reject(err))
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }
}
