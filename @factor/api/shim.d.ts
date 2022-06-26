// included via triple-slash in index

declare global {
  interface Window {
    process: { env?: Record<string, string> }
    GlobalInstance: any
  }
  namespace NodeJS {
    interface Global {
      GlobalInstance: any
    }
  }
  const GlobalInstance: any
}

declare module "*.vue" {
  import { Component } from "vue"
  const Component: Component
  export default Component
}

declare module "*.png" {
  const src: string
  export = src
}

declare module "*.webp" {
  const src: string
  export = src
}

declare module "*.jpg" {
  const src: string
  export = src
}

declare module "*.json" {
  const src: any[] | Record<string, any>
  export = src
}
declare module "*.svg" {
  const src: string
  export = src
}
declare module "*.css" {
  const src: string
  export = src
}
declare module "*.md" {
  import { MarkdownFile } from "@factor/api"
  const src: MarkdownFile
  export = src
}

declare module "*package"
declare module "std-env"
declare module "markdown-it-video"
declare module "markdown-it-link-attributes"
declare module "markdown-it-implicit-figures"
declare module "rand-token"
declare module "figures"
declare module "prettyoutput"
declare module "fake-indexeddb" {
  export default window.indexedDB
}

declare module "fake-indexeddb/lib/FDBKeyRange" {
  export default window.IDBKeyRange
}
