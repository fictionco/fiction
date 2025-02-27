import type { ViteDevServer } from 'vite'
import type { FictionMedia } from '../plugin-media'
import type { FictionPluginSettings } from '../plugin.js'
import type { MediaObject } from '../schemas/schemas'
import type { EndpointMeta } from '../utils/index.js'

import type { EmailSendConfig } from './util'
import { renderSSRHead } from '@unhead/ssr'
import { createHead } from '@unhead/vue'
import { EnvVar, vars } from '../plugin-env/index.js'
import { FictionPlugin } from '../plugin.js'
import { isTest, safeDirname, vue } from '../utils/index.js'
import { proseToMarkdown, renderMarkdown } from '../utils/markdown.js'
import { QueryTransactionalEmail } from './endpoint.js'

export * from './util'

const verify: EnvVar<string>['verify'] = ({ fictionEnv, value }) => {
  return !(!value && fictionEnv.isProd.value && !fictionEnv.isApp.value)
}

vars.register(() => [
  new EnvVar({ name: 'SMTP_HOST', verify }),
  new EnvVar({ name: 'SMTP_USER', verify }),
  new EnvVar({ name: 'SMTP_PASSWORD', verify }),
])

type FictionEmailSettings = {
  smtpPort?: number
  smtpHost?: string
  smtpUser?: string
  smtpPassword?: string
  sendingDomain?: string
} & FictionPluginSettings

export class FictionEmail extends FictionPlugin<FictionEmailSettings> {
  isTest = isTest()
  queries = {
    TransactionEmail: new QueryTransactionalEmail({ fictionEmail: this, ...this.settings }),
  }

  constructor(settings: FictionEmailSettings) {
    super('FictionEmail', { root: safeDirname(import.meta.url), ...settings })
  }

  // allow initialization of SMTP connection
  async init() {
    if (!this.fictionEnv?.isApp.value)
      this.queries.TransactionEmail.getClient()
  }

  renderer?: ViteDevServer
  async getNodeRenderer() {
    if (this.renderer)
      return this.renderer

    const { createServer } = await import('vite')
    const { default: vue } = await import('@vitejs/plugin-vue')
    this.renderer = await createServer({
      configFile: false,
      plugins: [vue()],
      server: { middlewareMode: true },
    })

    return this.renderer
  }

  async parseTemplateNode() {
    const { fileURLToPath } = await import('node:url')
    const path = await import('node:path')

    const templatePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'templates', 'EmailV2.vue')

    const renderer = await this.getNodeRenderer()

    try {
      const { default: EmailV2Component } = await renderer.ssrLoadModule(templatePath)
      return EmailV2Component as vue.Component
    }
    catch (error) {
      console.error('Error loading EmailV2.vue module:', error)
      throw error
    }
  }

  rawTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head><!--head--></head><body><!--app--></body></html>`

  async compileTemplateToHtml(args: { emailConfig: EmailSendConfig }): Promise<string> {
    const { emailConfig } = args
    const { renderToString } = await import('vue/server-renderer')

    if (!emailConfig.content && emailConfig.contentMarkdown) {
      emailConfig.content = await renderMarkdown(emailConfig.contentMarkdown)
    }

    const EmailV2: vue.Component = this.settings.fictionEnv.isApp.value
      ? vue.defineAsyncComponent(() => import('./templates/EmailV2.vue'))
      : await this.parseTemplateNode()

    const app: vue.App = vue.createSSRApp(EmailV2, emailConfig)

    const meta = createHead()
    app.use(meta)

    const htmlBody = await renderToString(app)
    console.log('emailConfig--------------------', emailConfig)
    console.log('htmlBody--------------------', htmlBody)

    const { headTags, htmlAttrs, bodyAttrs, bodyTags, bodyTagsOpen } = await renderSSRHead(meta)

    const html = this.rawTemplate
      .replace(`<!--head-->`, `\n${headTags}\n`)
      .replace(`<!--app-->`, `\n${htmlBody}\n`)
      .replace(/<body([^>]*)>/i, `<body$1 ${bodyAttrs}>`)
      .replace(/<html([^>]*)>/i, `<html$1 ${htmlAttrs}>`)
      .replace(/<body([^>]*)>/i, `<body$1>\n${bodyTagsOpen}\n`)
      .replace(/<\/body>/i, `\n${bodyTags}\n</body>`)

    return html
  }

  async renderAndSendEmail(emailConfig: EmailSendConfig, meta: EndpointMeta) {
    const html = await this.compileTemplateToHtml({ emailConfig })
    emailConfig.bodyHtml = html

    return this.sendEmail(emailConfig, meta)
  }

  async sendEmail(fields: EmailSendConfig, meta: EndpointMeta) {
    return this.queries.TransactionEmail.serve({ _action: 'send', fields }, { server: true, ...meta })
  }

  async emailImages({ fictionMedia }: { fictionMedia: FictionMedia }) {
    const images = {
      icon: 'img/fiction-icon.png',
      footer: 'img/fiction-email-footer.png',
    }
    const results = await Promise.all(
      Object.entries(images).map(async ([key, path]) => [
        key,
        await fictionMedia.relativeMedia({ url: new URL(path, import.meta.url).href }),
      ]),
    )

    return Object.fromEntries(results) as { [K in keyof typeof images]: MediaObject }
  }
}
