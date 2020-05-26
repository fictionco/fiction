export type ExtensionRecord = { packageName: string; featured?: true }[]

export const extensions: ExtensionRecord = [
  { packageName: "@factor/plugin-sitemap" },
  { packageName: "@factor/plugin-forum" },
  { packageName: "@factor/plugin-email-list", featured: true },
  { packageName: "@factor/plugin-jobs", featured: true },
  { packageName: "@factor/plugin-blog", featured: true },
  { packageName: "@factor/plugin-seo" },
  { packageName: "@factor/plugin-storage-s3" },
  { packageName: "@factor/plugin-google-tag-manager" },
  { packageName: "@factor/plugin-bugsnag" },
  { packageName: "@factor/plugin-highlight-code" },
  { packageName: "@factor/plugin-contact-form" },
  { packageName: "@factor/theme-alpha" },
  { packageName: "@factor/theme-ultra" },
  { packageName: "@factor/theme-zeno" },
]
