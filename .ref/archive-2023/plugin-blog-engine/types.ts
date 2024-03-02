import type { MarkdownFile, vue } from '@factor/api'
import { FactorObject, slugify } from '@factor/api'

interface PostAttributes {
  title?: string
  titleSub?: string
  description?: string
  excerpt?: string
  postImage?: string
  authorName?: string
  authorEmail?: string
  authorImage?: string
  authorWebsite?: string
  authorTwitter?: string
  publishDate?: string
}

export type PostEntryConfig = {
  readingMinutes?: number
  path?: string
  attributes?: Record<string, unknown>
  markdown?: string
  content?: string
  parentGroup?: PostNavGroup
  component?: vue.Component

  [key: string]: unknown
} & PostSingle &
PostAttributes

export interface PostSingle {
  nav?: boolean
  title?: string
  key?: string
  file?: () => Promise<MarkdownFile>
  path?: string
}
export type PostNavGroup = {
  title?: string
  description?: string
  icon?: string
  key?: string
  pages?: Record<string, PostSingle>
  docId?: string
} & PostSingle

export type PostTypes =
  | 'article'
  | 'guide'
  | 'tutorial'
  | 'video'
  | 'example'
  | 'resource'
  | 'reference'
  | 'update'
  | 'release'

export interface BlogPostParams<T extends string> {
  key: T
  status?: 'published' | 'draft'
  permalink?: string
  redirects?: string[]
  publishDate?: string
  fileImport?: () => Promise<{
    html: string
    VueComponent: vue.Component
    attributes: Record<string, unknown>
  }>
  imageImport?: () => Promise<{ default: string }>
  type?: PostTypes[]
  category?: string[]
  noList?: boolean
}

export class BlogPost<T extends string> extends FactorObject<
  BlogPostParams<T>
> {
  key = this.settings.key
  status = this.settings.status ?? 'draft'
  permalink = this.settings.permalink || slugify(this.key) || ''
  redirects = this.settings.redirects || []
  publishDate = this.settings.publishDate
  fileImport = this.settings.fileImport
  imageImport = this.settings.imageImport
  type = this.settings.type
  category = this.settings.category
  noList = this.settings.noList
  constructor(params: BlogPostParams<T>) {
    super('BlogPost', params)
  }
}

export type BlogPostKeysUtility<T extends BlogPost<string>[]> = {
  [K in keyof T]: T[K] extends BlogPost<infer T> ? T : never
}[number]

export interface IndexArgs {
  total?: number
  category?: string
}
