export type ExtensionRecord = { name: string; featured?: true }[]

export const extensions: ExtensionRecord = [
  { name: "@factor/plugin-sitemap" },
  { name: "@factor/plugin-email-list", featured: true },
  { name: "@factor/plugin-jobs", featured: true },
  { name: "@factor/plugin-blog", featured: true },
  { name: "@factor/plugin-seo" },
  { name: "@factor/plugin-storage-s3" },
  { name: "@factor/plugin-google-tag-manager" },
  { name: "@factor/plugin-ssr-bar" },
  { name: "@factor/plugin-bugsnag" },
  { name: "@factor/plugin-highlight-code" },
  { name: "@factor/plugin-notify" },
  { name: "@factor/plugin-contact-form" },
  { name: "@factor/theme-alpha" },
  { name: "@factor/theme-ultra" },
  { name: "@factor/theme-zeno" }
]
