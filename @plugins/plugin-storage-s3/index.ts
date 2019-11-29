import { addFilter, addCallback } from "@factor/tools"
import AWS from "aws-sdk"
import { PostAttachment } from "@factor/attachment"

addFilters()

function addFilters(): void {
  if (
    !process.env.AWS_ACCESS_KEY ||
    !process.env.AWS_ACCESS_KEY_SECRET ||
    !process.env.AWS_S3_BUCKET
  ) {
    addFilter("setup-needed", (__: { title: string }[]) => {
      return [
        ...__,
        {
          title: "Plugin: S3 Storage Credentials"
        }
      ]
    })

    return
  }

  addFilter(
    "storage-attachment-url",
    ({ buffer, key }: { buffer: Buffer; key: string }) => {
      const { bucket, S3 } = setConfig()
      return new Promise((resolve, reject) => {
        const params = { Bucket: bucket, Key: key, Body: buffer, ACL: "public-read" }
        S3.upload(params, (error: Error, data: { Location: string }) => {
          if (error) reject(error)

          const { Location } = data || {}

          resolve(Location)
        })
      })
    }
  )

  addCallback("delete-attachment", async (doc: PostAttachment) => {
    const { bucket, S3 } = setConfig()
    const key = doc.url.split("amazonaws.com/")[1]

    const params = { Bucket: bucket, Key: key }
    return await S3.deleteObject(params).promise()
  })
}

function setConfig(): { S3: AWS.S3; bucket: string } {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
  })

  const bucket = process.env.AWS_S3_BUCKET || ""
  const S3 = new AWS.S3()
  return { S3, bucket }
}
