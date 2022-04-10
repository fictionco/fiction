import { slugify, MarkdownFile } from "@factor/api"
import { Component } from "vue"

export type DocGroupRecord<T extends string = string> = Record<
  string,
  DocGroup<T>
>

export type DocGroup<T extends string = string> = {
  title?: string
  description?: string
  icon?: string
  path?: string
  menu?: T[]
}

export type DocItem = {
  title?: string
  fileImport: () => Promise<MarkdownFile>
  components?: Record<string, Component>
}

export type DocPageConfig = {
  path?: string
  attributes?: Record<string, string>
  markdown?: string
  content?: string
  parentGroup?: DocGroup
  component?: Component
} & Partial<DocItem>

export interface DocsOptions {
  baseRoute: string
  docs: Doc<string>[]
  groups: DocGroupRecord
}

export type DocParams<T extends string> = {
  key: T
  status?: "published" | "draft"
  permalink?: string
  publishDate?: string
  fileImport?: () => Promise<MarkdownFile>
  imageImport?: () => Promise<{ default: string }>
  category?: string[]
  title?: string
  components?: Record<string, Component>
}

export class Doc<T extends string> {
  key: T
  status: "published" | "draft"
  permalink: string
  publishDate?: string
  fileImport?: () => Promise<MarkdownFile>
  imageImport?: () => Promise<{ default: string }>
  category?: string[]
  title?: string
  components?: Record<string, Component>
  constructor(params: DocParams<T>) {
    this.key = params.key
    this.status = params.status ?? "draft"
    this.permalink = params.permalink || slugify(params.key) || ""
    this.publishDate = params.publishDate
    this.fileImport = params.fileImport
    this.imageImport = params.imageImport
    this.category = params.category
    this.title = params.title
    this.components = params.components
  }
}
