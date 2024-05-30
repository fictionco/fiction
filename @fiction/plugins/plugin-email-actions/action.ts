import type { EndpointMeta, EndpointResponse, TransactionalEmailConfig, User, vue } from '@fiction/core'
import { FictionObject, abort, deepMerge } from '@fiction/core'
import { getFromAddress } from '@fiction/core/utils/email'
import type { EmailResponse } from '@fiction/core/plugin-email/endpoint'
import { createEmailVars } from './utils'
import type { FictionEmailActions } from '.'

export type EmailVars<T extends object | undefined = object | undefined> = {
  actionId: string
  appName: string
  code: string
  callbackUrl: string
  fullName: string
  email: string
  userId: string
  username: string
  token: string
  originUrl: string
  unsubscribeUrl: string
  redirect: string
  queryVars: T
}

export type EmailActionSettings<T extends EmailActionSurface = EmailActionSurface > = {
  actionId: string
  template: vue.Component
  emailConfig: (args: EmailVars<T['queryVars']>) => TransactionalEmailConfig | Promise<TransactionalEmailConfig>
  vars?: Partial<EmailVars>
  serverAction?: (action: EmailAction, args: T['transactionArgs'], meta: EndpointMeta) => Promise< T['transactionResponse']>
  fictionEmailActions?: FictionEmailActions
}

export type EmailActionSurface = Partial<{
  transactionArgs: Record<string, unknown>
  transactionResponse: EndpointResponse
  queryVars: Record<string, string>
  sendResponse: EndpointResponse<{ isSent: boolean }>
}>

export type SendArgsSurface = Partial<{
  queryVars: Record<string, string>
  fields: Record<string, unknown>
}>

export type SendArgsRequest = {
  to: string
  fields?: Partial<User>
  origin?: string
  redirect?: string
  baseRoute?: string
}

export type SendEmailArgs = {
  recipient: Partial<User>
  isNew?: boolean
} & Partial<SendArgsRequest>

export class EmailAction<T extends EmailActionSurface = EmailActionSurface > extends FictionObject<EmailActionSettings<T>> {
  fictionEmailActions = this.settings.fictionEmailActions

  constructor(params: EmailActionSettings<T>) {
    super(`EmailAction:${params.actionId}`, params)

    if (this.fictionEmailActions)
      this.install(this.fictionEmailActions)
  }

  install(fictionEmailActions: FictionEmailActions) {
    this.fictionEmailActions = fictionEmailActions

    this.fictionEmailActions.emailActions[this.settings.actionId] = this as unknown as EmailAction
  }

  async requestEndpoint(args: T['transactionArgs']): Promise<T['transactionResponse']> {
    const r = await this.fictionEmailActions?.requests.EmailAction.request({ _action: 'runAction', actionId: this.settings.actionId, ...args })

    return r
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

  async serveSend(args: SendEmailArgs & { queryVars?: T['queryVars'] }, _meta: EndpointMeta): Promise<EndpointResponse<EmailResponse> & { emailVars: EmailVars }> {
    const fictionEmail = this.fictionEmailActions?.settings.fictionEmail
    if (!fictionEmail || !this.fictionEmailActions)
      throw abort('no fictionEmail provided')

    const emailVars = await createEmailVars({ ...args, fictionEmailActions: this.fictionEmailActions, actionId: this.settings.actionId })

    const userEmail = await this.settings.emailConfig(emailVars as EmailVars<T['queryVars']>)

    const defaultEmail = await this.defaultConfig()
    const finalEmail = deepMerge([defaultEmail, userEmail])

    const r = await fictionEmail.sendTransactional(finalEmail)

    return { ...r, emailVars }
  }

  async requestSend(args: SendArgsRequest & { queryVars: T['queryVars'] }): Promise<T['sendResponse']> {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { to } = args || {}

    if (!to)
      throw abort('no email recipient provided')

    const r = await this.fictionEmailActions?.requests.EmailAction.request({ ...args, _action: 'sendEmail', actionId: this.settings.actionId, origin, to })

    return r as T['sendResponse']
  }
}
