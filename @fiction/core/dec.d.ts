declare module '*.md' {
  import type { MarkdownFile } from '@fiction/core/index.ts'

  const src: MarkdownFile
  export = src
}
