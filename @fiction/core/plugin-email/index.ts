import type { FictionEnv } from '../plugin-env'
import { EnvVar, vars } from '../plugin-env'
import { FictionPlugin, type FictionPluginSettings } from '../plugin'
import { safeDirname } from '../utils'

import { QueryTransactionalEmail } from './endpoint'

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
  fictionEnv: FictionEnv
  smtpHost?: string
  smtpUser?: string
  smtpPassword?: string
} & FictionPluginSettings

export class FictionEmail extends FictionPlugin<FictionEmailSettings> {
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

  async sendTransactional() {
    return {}
  }
}
