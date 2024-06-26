import { EnvVar, vars } from '../plugin-env/index.js'
import { FictionPlugin, type FictionPluginSettings } from '../plugin.js'
import { type EndpointMeta, isTest, safeDirname } from '../utils/index.js'
import type EmailStandard from './templates/EmailStandard.vue'
import { QueryTransactionalEmail } from './endpoint.js'

export type TransactionalEmailConfig = InstanceType<typeof EmailStandard>['$props'] & { bodyHtml?: string, bodyText?: string }

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

  async sendTransactional(fields: TransactionalEmailConfig, meta: EndpointMeta) {
    return this.queries.TransactionEmail.serve({ _action: 'send', fields }, { server: true, ...meta })
  }

  emailImages() {
    return {
      icon: new URL('img/fiction-icon.png', import.meta.url).href,
      footer: new URL('img/fiction-email-footer.png', import.meta.url).href,
    }
  }
}
