// @fiction/posts/types.ts
import '@fiction/core'

type PostGlobalSettings = {
  urls: { url: string, isPrimary: true }[]
}

declare module '@fiction/core' {
  interface OrganizationConfig {
    posts?: PostGlobalSettings
  }
}
