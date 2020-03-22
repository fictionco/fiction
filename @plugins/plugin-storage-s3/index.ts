import { addFilter, addCallback } from "@factor/api"
import AWS from "aws-sdk"
import { PostAttachment } from "@factor/attachment"

const setConfig = (): { S3: AWS.S3; bucket: string } => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
  })

  const bucket = process.env.AWS_S3_BUCKET || ""
  const S3 = new AWS.S3()
  return { S3, bucket }
}

export const setup = (): void => {
  if (
    !process.env.AWS_ACCESS_KEY ||
    !process.env.AWS_ACCESS_KEY_SECRET ||
    !process.env.AWS_S3_BUCKET
  ) {
    addFilter({
      key: "s3Setup",
      hook: "setup-needed",
      callback: (__: { title: string }[]) => {
        return [
          ...__,
          {
            title: "Plugin: S3 Storage Credentials",
            file: ".env",
            name: "AWS_ACCESS_KEY"
          }
        ]
      }
    })

    return
  }

  addFilter({
    key: "handleUrlS3",
    hook: "storage-attachment-url",
    callback: ({
      buffer,
      key,
      mimetype
    }: {
      buffer: Buffer;
      key: string;
      mimetype: string;
    }) => {
      const { bucket, S3 } = setConfig()
      return new Promise((resolve, reject) => {
        const params = {
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ACL: "public-read",
          ContentType: mimetype
        }
        S3.upload(params, (error: Error, data: { Location: string }) => {
          if (error) reject(error)

          const { Location } = data || {}

          resolve(Location)
        })
      })
    }
  })

  addCallback({
    key: "deleteImageS3",
    hook: "delete-attachment",
    callback: async (doc: PostAttachment) => {
      const { bucket, S3 } = setConfig()
      const key = doc.url.split("amazonaws.com/")[1]

      const params = { Bucket: bucket, Key: key }
      return await S3.deleteObject(params).promise()
    }
  })
}

setup()
