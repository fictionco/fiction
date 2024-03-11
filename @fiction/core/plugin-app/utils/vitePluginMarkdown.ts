/* server-only-file */
import path from 'node:path'
import process from 'node:process'
import type { Plugin } from 'vite'
import type { TransformResult } from 'rollup'
import type { ChildNode } from 'domhandler'
import { Element } from 'domhandler'
import { DomUtils, parseDocument } from 'htmlparser2'
import { compileTemplate } from '@vue/compiler-sfc'
import fs from 'fs-extra'
import { parseMarkdownFile } from '../../utils/markdown'

export interface PluginOptions {
  markdown?: (body: string) => string
}

class ExportedContent {
  #exports: string[] = []
  #contextCode = ''

  addContext(contextCode: string): void {
    this.#contextCode += `${contextCode}\n`
  }

  addExporting(exported: string): void {
    this.#exports.push(exported)
  }

  export(): string {
    return [this.#contextCode, `export { ${this.#exports.join(', ')} }`].join(
      '\n',
    )
  }
}

class ParseHandler {
  staticFiles: { src: string, dest: string }[] = []
  distClient: string | undefined
  isProd: boolean
  constructor(args: { isProd: boolean, distClient?: string }) {
    const { isProd, distClient } = args
    this.distClient = distClient
    this.isProd = isProd
  }

  async transformMarkdownFiles(args: { code: string, id: string }): Promise<TransformResult> {
    const { code, id } = args

    if (!id.endsWith('.md'))
      return null

    const content = new ExportedContent()

    // RELATIVE IMAGE PATHS
    const imagePattern = /\.\.?\/[^\s)]+\.(jpg|jpeg|png|svg|gif|bmp|webp)/gi

    const resolvedCode = code.replaceAll(imagePattern, (match) => {
      const imagePath = path.resolve(path.dirname(id), match)
      const imageName = path.basename(imagePath)

      let url: string = match
      // If production, move the image to the dist folder
      // and return the new url
      if (this.isProd && this.distClient) {
        if (fs.existsSync(imagePath)) {
          console.warn('PUSHING IMAGE PATH', imagePath)
          this.staticFiles.push({
            src: imagePath,
            dest: path.join(this.distClient, imageName),
          })
          url = `/${imageName}`
        }
        else {
          console.warn(`File ${imagePath} does not exist and was not copied.`)
        }
      }
      else {
        // If development, return the correct relative path
        url = imagePath.replace(process.cwd(), '')
      }

      return url
    })

    const { attributes, bodyHtml, bodyMarkdown } = await parseMarkdownFile(resolvedCode)

    content.addContext(`const attributes = ${JSON.stringify(attributes)}`)
    content.addExporting('attributes')

    content.addContext(`const bodyMarkdown = \`${bodyMarkdown}\``)
    content.addExporting('bodyMarkdown')

    content.addContext(`const bodyHtml = ${JSON.stringify(bodyHtml)}`)
    content.addExporting('bodyHtml')

    const root = parseDocument(bodyHtml)

    // Top-level <pre> tags become <pre v-pre>
    root.children.forEach((node) => {
      if (node instanceof Element && ['pre', 'code'].includes(node.tagName))
        node.attribs['v-pre'] = 'true'
    })

    // Any <code> tag becomes <code v-pre> excepting under `<pre>`
    const markCodeAsPre = (node: ChildNode): void => {
      if (node instanceof Element) {
        if (node.tagName === 'code')
          node.attribs['v-pre'] = 'true'

        if (node.childNodes.length > 0)
          node.childNodes.forEach(_ => markCodeAsPre(_))
      }
    }
    root.children.forEach(n => markCodeAsPre(n))

    const { code: compiledVueCode } = compileTemplate({
      source: DomUtils.getOuterHTML(root, { decodeEntities: true }),
      filename: id,
      id,
    })
    content.addContext(
      `${compiledVueCode.replace(
        '\nexport function render(',
        '\nfunction vueRender(',
      )
        }\nconst VueComponent = { render: vueRender }\nVueComponent.__hmrId = ${JSON.stringify(
          id,
        )}\nconst VueComponentWith = (components) => ({ components, render: vueRender })\n`,
    )
    content.addExporting('VueComponent')
    content.addExporting('VueComponentWith')

    return {
      code: content.export(),
      map: null,
    }
  }
}

export function getMarkdownPlugins(args: {
  isProd: boolean
  distClient?: string | undefined
} = { isProd: false }): Plugin[] {
  const { isProd, distClient } = args

  const parseHandler = new ParseHandler({ isProd, distClient })
  return [
    {
      name: 'fiction-vite-markdown',
      enforce: 'pre',
      transform(code, id) {
        return parseHandler.transformMarkdownFiles({ code, id })
      },
      closeBundle() {
        const files = parseHandler.staticFiles

        files.forEach((file) => {
          const { src, dest } = file

          if (!fs.existsSync(src)) {
            console.warn('Missing file', src)
            return
          }
          if (isProd && (!distClient || !fs.existsSync(distClient))) {
            console.warn('Missing dist', distClient)
            return
          }
          console.warn('copying', src, dest)
          fs.copyFileSync(src, dest)
        })
      },
    },
  ]
}
