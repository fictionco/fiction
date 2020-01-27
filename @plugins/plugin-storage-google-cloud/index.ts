import { addFilter, addCallback } from "@factor/api"
import { Storage } from "@google-cloud/storage"
import { PostAttachment } from "@factor/attachment"

/**
 * Gets the service handler
 *
 * @remarks
 * GCP handles auth in a strange way with a JSON file that can be implicitly detected if
 * the path to it is set to "process.env.GOOGLE_APPLICATION_CREDENTIALS"
 *
 * However, in some environments this is obtuse so we allow a second env variable:
 * process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
 * which can be set to the raw JSON string
 */
const getService = (): {
  storage: Storage | undefined;
  bucketName: string | undefined;
} => {
  const rawCredentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  const rawCredentialJSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET
  let storage
  let credentials

  if (rawCredentialPath) {
    credentials = require(rawCredentialPath)
  } else if (rawCredentialJSON) {
    credentials = JSON.parse(rawCredentialJSON)
  }

  if (credentials) {
    storage = new Storage({ credentials })
  }

  return { storage, bucketName }
}

export const setup = (): void => {
  /**
   * Do we have the needed info?
   */
  let setupNeeded
  if (
    process.env.GOOGLE_CLOUD_STORAGE_BUCKET ||
    (!process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  ) {
    setupNeeded = true
  } else {
    setupNeeded = false
  }
  if (setupNeeded) {
    addFilter({
      key: "googleCloudStorageSetup",
      hook: "setup-needed",
      callback: (__: { title: string }[]) => {
        return [
          ...__,
          {
            title: "Plugin: Google Cloud Storage",
            file: ".env",
            name: "GOOGLE_APPLICATION_CREDENTIALS"
          }
        ]
      }
    })

    return
  }

  /**
   * Hooks into Factor's upload attachment filter and returns the GCS URL
   */
  addFilter({
    key: "handleUrlGCS",
    hook: "storage-attachment-url",
    callback: async ({ buffer, key }: { buffer: Buffer; key: string }) => {
      const { storage, bucketName } = getService()

      if (!storage || !bucketName) return

      const bucket = storage.bucket(bucketName)

      /**
       * https://googleapis.dev/nodejs/storage/latest/File.html#save
       *
       * Save is a wrapper of
       * https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
       */
      const file = bucket.file(key)

      await file.save(buffer)

      /**
       * Apparently Google wants us to construct the URL manually
       * https://stackoverflow.com/a/20479113/1858322
       */
      const url = `http://storage.googleapis.com/${bucketName}/${key}`

      return url
    }
  })

  /**
   * When a user deletes an image, we have the post doc
   * Get the url, calculate the asset 'key' or file and delete with GCS
   */
  addCallback({
    key: "deleteImageS3",
    hook: "delete-attachment",
    callback: async (doc: PostAttachment) => {
      const { storage, bucketName } = getService()

      if (!storage || !bucketName) return

      const bucket = storage.bucket(bucketName)

      const key = doc.url.split(`${bucketName}/`)[1]

      const file = bucket.file(key)

      /**
       * Delete in bucket
       * https://googleapis.dev/nodejs/storage/latest/File.html#delete
       */
      await file.delete()

      // const apiResponse = data[0]

      return
    }
  })
}

setup()
