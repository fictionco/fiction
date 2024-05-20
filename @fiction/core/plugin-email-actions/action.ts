import { createUserToken } from '../utils/jwt'
import { abort } from '../utils/error'
import type { vue } from '../utils/libraries'
import type { User } from '../plugin-user'
import { FictionObject } from '../plugin'
import type { TransactionalEmailConfig } from '../plugin-email'
import { deepMerge } from '../utils'
import { getFromAddress } from '../utils/email'
import type { FictionEmailActions } from '.'

export type EmailVars = {
  actionId: string
  appName: string
  code: string
  callbackUrl: string
  firstName: string
  lastName: string
  email: string
  userId: string
  username: string
  token: string
  originUrl: string
  unsubscribeUrl: string
}

export type EmailActionSettings = {
  actionId: string
  template: vue.Component
  fictionEmailActions?: FictionEmailActions
  emailConfig: (args: EmailVars) => TransactionalEmailConfig | Promise<TransactionalEmailConfig>
  vars?: Partial<EmailVars>
}

type SendEmailArgs = {
  user: Partial<User>
  query?: Record<string, string>
  origin?: string
  vars?: Partial<EmailVars>
}

export class EmailAction extends FictionObject<EmailActionSettings> {
  fictionEmailActions = this.settings.fictionEmailActions
  fictionEmail = this.settings.fictionEmailActions?.settings.fictionEmail
  fictionEnv = this.settings.fictionEmailActions?.settings.fictionEnv
  fictionApp = this.settings.fictionEmailActions?.settings.fictionApp
  constructor(params: EmailActionSettings) {
    super(`EmailAction:${params.actionId}`, params)

    if (!this.settings.fictionEmailActions)
      throw abort('no fictionEmailActions provided')

    this.settings.fictionEmailActions.emailActions[this.settings.actionId] = this
  }

  async defaultConfig(): Promise<TransactionalEmailConfig> {
    const fictionMedia = this.settings.fictionEmailActions?.settings.fictionMedia
    if (!fictionMedia)
      throw abort('no fictionMedia provided')

    const emailImages = this.fictionEmail?.emailImages()
    const superImage = await fictionMedia.relativeMedia({ url: emailImages?.icon || '' })
    const footerImage = await fictionMedia.relativeMedia({ url: emailImages?.footer || '' })

    return {
      from: getFromAddress({ fictionEnv: this.fictionEnv }),
      mediaSuper: {
        media: { url: superImage.url },
        name: 'Fiction',
        href: `https://www.fiction.com`,
      },
      mediaFooter: {
        media: { url: footerImage.url },
        name: 'Market Yourself with Fiction',
        href: `https://www.fiction.com`,
      },
    }
  }

  emailVars?: EmailVars
  async createEmailVars(args: SendEmailArgs) {
    const { user, query = {}, origin, vars } = args

    const tokenSecret = this.settings.fictionEmailActions?.settings.fictionUser.settings.tokenSecret
    if (!tokenSecret)
      throw abort('no tokenSecret provided')

    const originUrl = origin || this.fictionApp?.appUrl.value || ''
    const queryParams = new URLSearchParams(query).toString()
    const token = user ? createUserToken({ user, tokenSecret }) : ''
    const callbackBase = `${originUrl}/_action`
    const callbackUrl = `${callbackBase}/${this.settings.actionId}/?token=${token}&${queryParams}`
    const { firstName, lastName, email, userId, username } = user

    const emailVars: EmailVars = {
      actionId: this.settings.actionId,
      callbackUrl,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      userId: userId || '',
      username: username || '',
      token,
      originUrl: originUrl || '',
      unsubscribeUrl: `${callbackBase}/unsubscribe`,
      appName: this.fictionEmail?.settings.fictionEnv.meta.app?.name || '',
      code: 'NOT_PROVIDED',
      ...vars,
    }

    this.emailVars = emailVars

    return emailVars
  }

  async send(args: SendEmailArgs) {
    if (!this.fictionEmail)
      throw abort('no fictionEmail provided')

    const emailVars = await this.createEmailVars(args)

    const userEmail = await this.settings.emailConfig(emailVars)
    const defaultEmail = await this.defaultConfig()
    const finalEmail = deepMerge([defaultEmail, userEmail])

    return await this.fictionEmail.sendTransactional(finalEmail)
  }
}
