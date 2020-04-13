export interface DocsItem {
  group?: string
  slug: string
  route?: string
  name?: string
  title?: string
  description?: string
  file?: () => Promise<{ default: string }>
  root?: boolean
}
