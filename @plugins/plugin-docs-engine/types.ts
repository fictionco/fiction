import { MarkdownFile } from "@factor/types"
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
  docs: Record<string, DocItem>
  groups: DocGroupRecord
}

// export interface DocSingle {
//   nav?: boolean
//   title?: string
//   key?: string
//   file?: () => Promise<MarkdownFile>
//   path?: string
//   components?: Record<string, Component>
// }
// export type DocsNavGroup = {
//   title?: string
//   description?: string
//   icon?: string
//   key?: string
//   pages?: Record<string, DocSingle>
//   docId?: string
// } & DocSingle

// export type DocsMap = Record<string, DocsNavGroup>
