declare module '*.md' {
  import type { MarkdownFile } from '@fiction/core'

  const src: MarkdownFile
  export = src
}
