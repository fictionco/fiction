import type { EndpointMeta, EndpointResponse, TransactionalEmailConfig, User, vue } from '@fiction/core'
import { FictionObject, abort, deepMerge } from '@fiction/core'
import { createUserToken } from '@fiction/core/utils/jwt'
import { getFromAddress } from '@fiction/core/utils/email'
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

type BaseParams = Record<string, unknown>

export type EmailActionSettings<T extends BaseParams = BaseParams, U extends EndpointResponse = EndpointResponse> = {
  actionId: string
  template: vue.Component
  emailConfig: (args: EmailVars) => TransactionalEmailConfig | Promise<TransactionalEmailConfig>
  vars?: Partial<EmailVars>
  serverAction?: (action: EmailAction, args: T, meta: EndpointMeta) => Promise<U>
  fictionEmailActions?: FictionEmailActions
}

type SendEmailArgs = {
  user: Partial<User>
  origin?: string
  queryVars?: Partial<EmailVars>
}

export class EmailAction<T extends BaseParams = BaseParams, U extends EndpointResponse = EndpointResponse> extends FictionObject<EmailActionSettings<T, U>> {
  fictionEmailActions = this.settings.fictionEmailActions

  constructor(params: EmailActionSettings<T, U>) {
    super(`EmailAction:${params.actionId}`, params)

    if (this.fictionEmailActions)
      this.install(this.fictionEmailActions)
  }

  install(fictionEmailActions: FictionEmailActions) {
    this.fictionEmailActions = fictionEmailActions

    this.fictionEmailActions.emailActions[this.settings.actionId] = this as EmailAction
  }

  async requestEndpoint(args: T) {
    return await this.fictionEmailActions?.requests.EmailAction.request({ actionId: this.settings.actionId, ...args })
  }

  async defaultConfig(): Promise<TransactionalEmailConfig> {
    const fictionEmailActions = this.fictionEmailActions
    const fictionMedia = fictionEmailActions?.settings.fictionMedia
    const fictionEmail = fictionEmailActions?.settings.fictionEmail
    const fictionEnv = fictionEmailActions?.settings.fictionEnv

    if (!fictionMedia)
      throw abort('no fictionMedia provided')

    const emailImages = fictionEmail?.emailImages()
    const superImage = await fictionMedia.relativeMedia({ url: emailImages?.icon || '' })
    const footerImage = await fictionMedia.relativeMedia({ url: emailImages?.footer || '' })

    return {
      from: getFromAddress({ fictionEnv }),
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
  async createEmailVars(args: SendEmailArgs): Promise<EmailVars> {
    const { user, origin, queryVars = {} } = args

    const fictionEmailActions = this.fictionEmailActions
    const fictionApp = fictionEmailActions?.settings.fictionApp
    const fictionEmail = fictionEmailActions?.settings.fictionEmail
    const tokenSecret = fictionEmailActions?.settings.fictionUser.settings.tokenSecret
    if (!tokenSecret)
      throw abort('no tokenSecret provided')

    const originUrl = origin || fictionApp?.appUrl.value || ''
    let token = ''
    if (user)
      token = queryVars.token = createUserToken({ user, tokenSecret })

    const queryParams = new URLSearchParams(queryVars).toString()
    const callbackBase = `${originUrl}/_action`
    const callbackUrl = `${callbackBase}/${this.settings.actionId}/?${queryParams}`
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
      appName: fictionEmail?.settings.fictionEnv.meta.app?.name || '',
      code: 'NOT_PROVIDED',
      ...queryVars,
    }

    this.emailVars = emailVars

    return emailVars
  }

  async send(args: SendEmailArgs) {
    const fictionEmail = this.fictionEmailActions?.settings.fictionEmail
    if (!fictionEmail)
      throw abort('no fictionEmail provided')

    const emailVars = await this.createEmailVars(args)

    const userEmail = await this.settings.emailConfig(emailVars)
    const defaultEmail = await this.defaultConfig()
    const finalEmail = deepMerge([defaultEmail, userEmail])

    return await fictionEmail.sendTransactional(finalEmail)
  }
}
