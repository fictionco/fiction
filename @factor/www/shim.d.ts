declare module "*.md" {
  import { MarkdownFile } from "@factor/api"
  const src: MarkdownFile
  export = src
}
