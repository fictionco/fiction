import { FactorPlugin } from "@factor/api"
import type { CloudFront, Invalidation } from "@aws-sdk/client-cloudfront"
import type {
  S3,
  PutObjectCommandOutput,
  GetObjectCommandOutput,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3"
import type { MediaConfig } from "../plugin-media"

type FactorAwsSettings = {
  awsAccessKey?: string
  awsAccessKeySecret?: string
  region?: string
}

type S3FileOutput = GetObjectCommandOutput & {
  key: string
  data?: string
}

type S3UploadOptions = {
  filePath: string
  bucket: string
  mime: string
  data: string | Buffer | Uint8Array | ReadableStream<any> | Blob
  accessControl?: "public-read" | "private"
}

export class FactorAws extends FactorPlugin<FactorAwsSettings> {
  awsAccessKey = this.settings.awsAccessKey
  awsAccessKeySecret = this.settings.awsAccessKeySecret
  region = this.settings.region || "us-east-1"
  cloudFront?: CloudFront
  s3?: S3

  constructor(settings: FactorAwsSettings) {
    super(settings)

    const { awsAccessKey, awsAccessKeySecret } = settings

    if (this.utils.isApp()) return

    if (!awsAccessKey || !awsAccessKeySecret) {
      this.log.warn(
        "could not create aws client: no awsAccessKey or awsAccessKeySecret",
      )
      return
    }
  }
  setup = () => {}

  getCloudFront = async (): Promise<CloudFront> => {
    if (!this.awsAccessKey || !this.awsAccessKeySecret) {
      throw new Error("creds not available")
    }
    if (!this.cloudFront) {
      const { CloudFront } = await import("@aws-sdk/client-cloudfront")
      this.cloudFront = new CloudFront({
        apiVersion: "2020-05-31",
        region: this.region,
        credentials: {
          accessKeyId: this.awsAccessKey,
          secretAccessKey: this.awsAccessKeySecret,
        },
      })
    }
    return this.cloudFront
  }

  getS3 = async (): Promise<S3> => {
    if (!this.awsAccessKey || !this.awsAccessKeySecret) {
      throw new Error("creds not available")
    }
    if (!this.s3) {
      const { S3 } = await import("@aws-sdk/client-s3")
      this.s3 = new S3({
        apiVersion: "2006-03-01",
        region: this.region,
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
    filePath,
    bucket,
    mime,
    data,
    accessControl = "public-read",
  }: S3UploadOptions): Promise<{
    url: string
    result: PutObjectCommandOutput
  }> => {
    if (!bucket) throw new Error("no bucket set")
    const s3 = await this.getS3()
    const result: PutObjectCommandOutput = await s3.putObject({
      Body: data,
      Bucket: bucket,
      Key: filePath,
      ContentType: mime,
      ACL: accessControl,
    })

    return {
      url: `https://${bucket}.s3.amazonaws.com/${filePath}`,
      result,
    }
  }
  deleteS3 = async ({
    filePath,
    bucket,
  }: {
    filePath: string
    bucket: string
  }): Promise<{
    result: DeleteObjectCommandOutput
  }> => {
    if (!bucket) throw new Error("no bucket set")
    const s3 = await this.getS3()
    const result = await s3.deleteObject({
      Bucket: bucket,
      Key: filePath,
    })

    return {
      result,
    }
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
    if (!bucket) throw new Error("no bucket set")
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
    if (!bucket) throw new Error("no bucket set")
    try {
      const s3 = await this.getS3()
      await s3.headObject({ Bucket: bucket, Key: name })
      return true
    } catch {
      return false
    }
  }

  streamToString = async (stream?: NodeJS.ReadableStream): Promise<string> => {
    if (!stream) return ""
    const chunks: Uint8Array[] = []
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
      stream.on("error", (err: Error) => reject(err))
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    })
  }
}
