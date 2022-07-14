import Frontmatter from "front-matter"
import type MarkdownIt from "markdown-it"
import type { Plugin } from "vite"
import type { TransformResult } from "rollup"
import { ChildNode, Element } from "domhandler"
import { parseDocument, DomUtils } from "htmlparser2"
import { compileTemplate } from "@vue/compiler-sfc"
import { getMarkdownUtility } from "../../utils/markdown"

export interface PluginOptions {
  markdown?: (body: string) => string
  markdownIt?: MarkdownIt | MarkdownIt.Options
}

const markdownCompiler = ():
  | MarkdownIt
  | { render: (body: string) => string } => {
  return getMarkdownUtility({ html: true })
}

class ExportedContent {
  #exports: string[] = []
  #contextCode = ""

  addContext(contextCode: string): void {
    this.#contextCode += `${contextCode}\n`
  }

  addExporting(exported: string): void {
    this.#exports.push(exported)
  }

  export(): string {
    return [this.#contextCode, `export { ${this.#exports.join(", ")} }`].join(
      "\n",
    )
  }
}

const tf = (code: string, id: string): TransformResult => {
  if (!id.endsWith(".md")) return null

  const content = new ExportedContent()
  const fm = Frontmatter<unknown>(code)
  content.addContext(`const attributes = ${JSON.stringify(fm.attributes)}`)
  content.addExporting("attributes")

  const html = markdownCompiler().render(fm.body)

  content.addContext(`const html = ${JSON.stringify(html)}`)
  content.addExporting("html")

  const root = parseDocument(html)

  // Top-level <pre> tags become <pre v-pre>
  root.children.forEach((node) => {
    if (node instanceof Element && ["pre", "code"].includes(node.tagName)) {
      node.attribs["v-pre"] = "true"
    }
  })

  // Any <code> tag becomes <code v-pre> excepting under `<pre>`
  const markCodeAsPre = (node: ChildNode): void => {
    if (node instanceof Element) {
      if (node.tagName === "code") {
        node.attribs["v-pre"] = "true"
      }
      if (node.childNodes.length > 0) {
        node.childNodes.forEach((_) => markCodeAsPre(_))
      }
    }
  }
  root.children.forEach((n) => markCodeAsPre(n))

  const { code: compiledVueCode } = compileTemplate({
    source: DomUtils.getOuterHTML(root, { decodeEntities: true }),
    filename: id,
    id,
  })
  content.addContext(
    compiledVueCode.replace(
      "\nexport function render(",
      "\nfunction vueRender(",
    ) +
      `\nconst VueComponent = { render: vueRender }\nVueComponent.__hmrId = ${JSON.stringify(
        id,
      )}\nconst VueComponentWith = (components) => ({ components, render: vueRender })\n`,
  )
  content.addExporting("VueComponent")
  content.addExporting("VueComponentWith")

  return {
    code: content.export(),
  }
}

export const markdownPlugin = (): Plugin => {
  return {
    name: "factor-vite-markdown",
    enforce: "pre",
    transform(code, id) {
      return tf(code, id)
    },
  }
}
