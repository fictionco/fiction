export type ExtensionRecord = {
  packageName: string
  featured?: true
  discover?: boolean
}[]

export const extensions: ExtensionRecord = [
  { packageName: "@factor/plugin-sitemap" },
  { packageName: "@factor/plugin-forum", featured: true },
  { packageName: "@factor/plugin-email-list", featured: true },
  { packageName: "@factor/plugin-jobs", featured: true },
  { packageName: "@factor/plugin-blog", featured: true },
  { packageName: "@factor/plugin-seo" },
  { packageName: "@factor/plugin-storage-s3", discover: false },
  { packageName: "@factor/plugin-google-tag-manager" },
  { packageName: "@factor/plugin-bugsnag" },
  { packageName: "@factor/plugin-highlight-code" },
  { packageName: "@factor/plugin-contact-form" },
  { packageName: "@factor/theme-alpha" },
  { packageName: "@factor/theme-ultra" },
  { packageName: "@factor/theme-zeno" },
  { packageName: "@factor/plugin-ssr-bar", discover: false },
  { packageName: "@factor/plugin-notify", discover: false },
]
