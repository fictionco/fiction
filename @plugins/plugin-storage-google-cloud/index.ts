import { addFilter, addCallback } from "@factor/api"
import Storage from "@google-cloud/storage"
import { PostAttachment } from "@factor/attachment"

/**
 * Gets the service handler
 */
// const getService = (): {} => {
//   return {}
// }

export const setup = (): void => {
  const credentials: string[] = []
  if (credentials.some(_ => typeof _ === "undefined")) {
    addFilter({
      key: "googleCloudStorageSetup",
      hook: "setup-needed",
      callback: (__: { title: string }[]) => {
        return [
          ...__,
          {
            title: "Plugin: Google Cloud Storage Credentials"
          }
        ]
      }
    })

    return
  }

  addFilter({
    key: "handleUrlGCS",
    hook: "storage-attachment-url",
    callback: ({ buffer, key }: { buffer: Buffer; key: string }) => {
      // const { bucket, S3 } = getService()
      // return new Promise((resolve, reject) => {
      //   const params = { Bucket: bucket, Key: key, Body: buffer, ACL: "public-read" }
      //   S3.upload(params, (error: Error, data: { Location: string }) => {
      //     if (error) reject(error)
      //     const { Location } = data || {}
      //     resolve(Location)
      //   })
      // })
    }
  })

  addCallback({
    key: "deleteImageGCS",
    hook: "delete-attachment",
    callback: async (doc: PostAttachment) => {
      // const { bucket, S3 } = getService()
      // const key = doc.url.split("amazonaws.com/")[1]
      // const params = { Bucket: bucket, Key: key }
      // return await S3.deleteObject(params).promise()
    }
  })
}

setup()
