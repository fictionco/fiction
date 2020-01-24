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
const getService = (): { storage: Storage | undefined } => {
  const rawCredentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? false
  const rawCredentialJSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ?? false

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

  return { storage }
}

export const setup = (): void => {
  const credentials: (string | undefined)[] = [
    process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  ]
  if (credentials.some(_ => typeof _ === "undefined")) {
    addFilter({
      key: "googleCloudStorageSetup",
      hook: "setup-needed",
      callback: (__: { title: string }[]) => {
        return [
          ...__,
          {
            title: "Plugin: Google Cloud Storage"
          }
        ]
      }
    })

    return
  }

  addFilter({
    key: "handleUrlGCS",
    hook: "storage-attachment-url",
    callback: async ({ buffer, key }: { buffer: Buffer; key: string }) => {
      const { storage } = getService()

      const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET

      if (!storage || !bucketName) return

      await storage.bucket(bucketName).upload(key)

      const url = ""

      return url
    }
  })

  addCallback({
    key: "deleteImageS3",
    hook: "delete-attachment",
    callback: async (doc: PostAttachment) => {}
  })
}

setup()
