import { MarkdownFile } from "@factor/types"
import { Component } from "vue"

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
  attributes?: Record<string, string | string[]>
  markdown?: string
  content?: string
  parentGroup?: PostNavGroup
  component?: Component

  [key: string]:
    | string
    | string[]
    | number
    | boolean
    | PostNavGroup
    | Component
    | undefined
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
  | "article"
  | "guide"
  | "tutorial"
  | "video"
  | "example"
  | "resource"
  | "reference"
  | "update"

export type BlogMapItem = {
  status?: "published" | "draft"
  publishDate?: string
  fileImport?: () => Promise<MarkdownFile>
  imageImport?: () => Promise<{ default: string }>
  type?: PostTypes[]
  category?: string[]
}
export type BlogMap = Record<string, BlogMapItem>

export interface BlogOptions {
  baseRoute: string
  map: BlogMap
}
