declare module '*.md' {
  import type { MarkdownFile } from '@factor/api'

  const src: MarkdownFile
  export = src
}
