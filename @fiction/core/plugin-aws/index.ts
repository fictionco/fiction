import type { CloudFront, Invalidation } from '@aws-sdk/client-cloudfront'
import type { DeleteObjectCommandOutput, GetObjectCommandOutput, HeadObjectCommandOutput, PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3'
import type { Buffer } from 'node:buffer'
import type { FictionPluginSettings } from '../plugin.js'
import { FictionPlugin } from '../plugin.js'
import { EnvVar, vars } from '../plugin-env/index.js'
import { objectId } from '../utils/id.js'
import { getNodeBuffer } from '../utils/nodeUtils'

vars.register(() => [
  new EnvVar({ name: 'AWS_ACCESS_KEY' }),
  new EnvVar({ name: 'AWS_ACCESS_KEY_SECRET' }),
  new EnvVar({ name: 'AWS_BUCKET_MEDIA' }),
  new EnvVar({ name: 'AWS_REGION', isOptional: true }),
])

type FictionAwsSettings = {
  awsAccessKey?: string
  awsAccessKeySecret?: string
  awsRegion?: string
  awsBucketMedia?: string
} & FictionPluginSettings

type S3FileOutput = GetObjectCommandOutput & {
  key: string
  data?: string
}

interface S3UploadOptions {
  filePath: string
  bucket: string
  mime: string
  data: string | Buffer | Uint8Array | ReadableStream<any> | Blob
  accessControl?: 'public-read' | 'private'
}

export class FictionAws extends FictionPlugin<FictionAwsSettings> {
  awsAccessKey = this.settings.awsAccessKey
  awsAccessKeySecret = this.settings.awsAccessKeySecret
  awsRegion = this.settings.awsRegion || 'us-west-2'
  awsBucketMedia = this.settings.awsBucketMedia
  cloudFront?: CloudFront
  s3?: S3
  constructor(settings: FictionAwsSettings) {
    super('FictionAws', settings)

    const { awsAccessKey, awsAccessKeySecret } = settings

    if (this.fictionEnv?.isApp.value)
      return

    if (!awsAccessKey || !awsAccessKeySecret)
      this.log.warn('no aws client (missing awsAccessKey/awsAccessKeySecret)')
  }

  getCloudFront = async (): Promise<CloudFront> => {
    if (!this.awsAccessKey || !this.awsAccessKeySecret)
      throw new Error('creds not available')

    if (!this.cloudFront) {
      const { CloudFront } = await import('@aws-sdk/client-cloudfront')
      this.cloudFront = new CloudFront({
        apiVersion: '2020-05-31',
        region: this.awsRegion,
        credentials: {
          accessKeyId: this.awsAccessKey,
          secretAccessKey: this.awsAccessKeySecret,
        },
      })
    }
    return this.cloudFront
  }

  getS3 = async (): Promise<S3> => {
    if (!this.awsAccessKey || !this.awsAccessKeySecret)
      throw new Error('creds not available')

    if (!this.s3) {
      const { S3 } = await import('@aws-sdk/client-s3')
      this.s3 = new S3({
        apiVersion: '2006-03-01',
        region: this.awsRegion,
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
        CallerReference: objectId(),
        Paths: {
          Items: paths,
          Quantity: paths.length, // ???
        },
      },
    })

    return r.Invalidation
  }

  getUrlFromKey(args: { key: string, bucket?: string }): string {
    const { key, bucket = this.awsBucketMedia } = args
    return `https://${bucket}.s3.amazonaws.com/${key}`
  }

  /**
   * Upload to s3
   * @remarks
   *  - access control: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
   */
  uploadS3 = async (args: S3UploadOptions): Promise<{
    url: string
    result: PutObjectCommandOutput
    headObject: HeadObjectCommandOutput
  }> => {
    const { filePath, bucket = this.awsBucketMedia, mime, data, accessControl = 'public-read' } = args

    if (!bucket)
      throw new Error('no bucket set')

    try {
      const s3 = await this.getS3()

      const result: PutObjectCommandOutput = await s3.putObject({
        Body: data,
        Bucket: bucket,
        Key: filePath,
        ContentType: mime,
        ACL: accessControl,
      })

      const headObject = await s3.headObject({ Bucket: bucket, Key: filePath })

      return {
        url: this.getUrlFromKey({ key: filePath, bucket }),
        result,
        headObject,
      }
    }
    catch (e) {
      this.log.error('uploadS3 error', { data: { filePath, bucket, mime, region: this.awsRegion } })
      throw e
    }
  }

  async deleteDirectory(args: { directory: string, bucket: string }): Promise<{ result: DeleteObjectCommandOutput }> {
    const { directory, bucket = this.awsBucketMedia } = args
    if (!bucket)
      throw new Error('no bucket set')

    const s3 = await this.getS3()

    try {
      const r = await s3.listObjectsV2({ Bucket: bucket, Prefix: directory })

      const keys = r.Contents?.map(item => ({ Key: item.Key })) || []

      this.log.warn(`deleting directory ${directory}`, { data: keys, r })

      const result = await s3.deleteObjects({
        Bucket: bucket,
        Delete: {
          Objects: keys,
          Quiet: false,
        },
      })

      return { result }
    }
    catch (e) {
      this.log.error('deleteDirectory error', { data: { directory, bucket, region: this.awsRegion } })
      throw e
    }
  }

  deleteS3 = async (args: { filePath: string, bucket: string }): Promise<{ result: DeleteObjectCommandOutput }> => {
    const { filePath, bucket = this.awsBucketMedia } = args
    if (!bucket)
      throw new Error('no bucket set')
    const s3 = await this.getS3()

    const result = await s3.deleteObject({ Bucket: bucket, Key: filePath })

    return { result }
  }

  /**
   * Download a file from s3
   */
  downloadS3 = async (args: {
    key: string
    bucket?: string
    returnString?: boolean
  }): Promise<S3FileOutput> => {
    const { key, bucket = this.awsBucketMedia, returnString } = args
    if (!bucket)
      throw new Error('no bucket set')
    const s3 = await this.getS3()
    const result = await s3.getObject({ Bucket: bucket, Key: key })

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
  fileExistsS3 = async (args: { storageKeyPath: string, bucket: string }): Promise<string | undefined> => {
    const { storageKeyPath, bucket = this.awsBucketMedia } = args
    if (!bucket)
      throw new Error('no bucket set')
    try {
      const s3 = await this.getS3()
      await s3.headObject({ Bucket: bucket, Key: storageKeyPath })
      return this.getUrlFromKey({ key: storageKeyPath, bucket })
    }
    catch {
      return undefined
    }
  }

  streamToString = async (stream?: NodeJS.ReadableStream): Promise<string> => {
    if (!stream)
      return ''
    const chunks: Uint8Array[] = []
    const Buffer = getNodeBuffer()
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
      stream.on('error', (err: Error) => reject(err))
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }
}
