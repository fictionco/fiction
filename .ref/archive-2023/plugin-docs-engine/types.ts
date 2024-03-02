import type { MarkdownFile, vue } from '@factor/api'
import { slugify } from '@factor/api'

export type DocGroupRecord<T extends string = string> = Record<
  string,
  DocGroup<T>
>

export interface DocGroup<T extends string = string> {
  title?: string
  description?: string
  icon?: string
  path?: string
  menu?: T[]
}

export interface DocItem {
  title?: string
  fileImport: () => Promise<MarkdownFile>
  components?: Record<string, vue.Component>
}

export type DocPageConfig = {
  path?: string
  attributes?: Record<string, string>
  markdown?: string
  content?: string
  parentGroup?: DocGroup
  component?: vue.Component
} & Partial<DocItem>

export interface DocParams<T extends string> {
  key: T
  status?: 'published' | 'draft'
  permalink?: string
  publishDate?: string
  fileImport?: () => Promise<unknown>
  imageImport?: () => Promise<{ default: string }>
  category?: string[]
  title?: string
  components?: Record<string, vue.Component>
}

export class Doc<T extends string> {
  key: T
  status: 'published' | 'draft'
  permalink: string
  publishDate?: string
  fileImport?: () => Promise<MarkdownFile>
  imageImport?: () => Promise<{ default: string }>
  category?: string[]
  title?: string
  components?: Record<string, vue.Component>
  constructor(params: DocParams<T>) {
    this.key = params.key
    this.status = params.status ?? 'draft'
    this.permalink = params.permalink || slugify(params.key) || ''
    this.publishDate = params.publishDate
    this.fileImport = params.fileImport as () => Promise<MarkdownFile>
    this.imageImport = params.imageImport
    this.category = params.category
    this.title = params.title
    this.components = params.components
  }
}
