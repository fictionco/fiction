declare module "*package"
declare module "std-env"
declare module "gravatar"
declare module "markdown-it-video"
declare module "markdown-it-link-attributes"
declare module "markdown-it-implicit-figures"
declare module "rand-token"
declare module "figures"
declare module "*.png" {
  const value: string
  export = value
}
declare module "*.webp" {
  const value: string
  export = value
}
declare module "*.jpg" {
  const value: string
  export = value
}
declare module "*.webp" {
  const value: string
  export = value
}
declare module "*.json" {
  const value: any[] | Record<string, any>
  export = value
}
declare module "*.svg" {
  const value: string
  export = value
}
declare module "*.css" {
  const value: string
  export = value
}
declare module "*.md" {
  import { MarkdownFile } from "@factor/types"
  const value: MarkdownFile
  export = value
}
