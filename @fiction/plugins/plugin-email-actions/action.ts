import type { EndpointMeta, EndpointResponse, TransactionalEmailConfig, User, vue } from '@fiction/core'
import { FictionObject, abort, deepMerge } from '@fiction/core'
import { getFromAddress } from '@fiction/core/utils/email'
import type { EmailResponse } from '@fiction/core/plugin-email/endpoint'
import { createEmailVars } from './utils'
import type { FictionEmailActions } from '.'

export type EmailVars = {
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
}

export type EmailActionSettings<T extends EmailActionSurface = EmailActionSurface > = {
  actionId: string
  template: vue.Component
  emailConfig: (args: EmailVars) => TransactionalEmailConfig | Promise<TransactionalEmailConfig>
  vars?: Partial<EmailVars>
  serverAction?: (action: EmailAction, args: T['transactionArgs'], meta: EndpointMeta) => Promise< T['transactionResponse']>
  sendAction?: (action: EmailAction, args: T['sendArgs'], meta: EndpointMeta) => Promise< T['sendResponse']>
  fictionEmailActions?: FictionEmailActions
}

export type EmailActionSurface = Partial<{
  transactionArgs: Record<string, unknown>
  transactionResponse: EndpointResponse
  sendArgs: SendArgsRequest
  sendResponse: EndpointResponse<{ isSent: boolean }>
}>

export type SendArgsSurface = Partial<{
  queryVars: Record<string, string>
  fields: Record<string, unknown>
}>

export type SendArgsRequest<T extends SendArgsSurface = SendArgsSurface > = {
  to: string
  queryVars?: T['queryVars']
  fields?: T['fields']
  origin?: string
  redirect?: string
  baseRoute?: string
}

export type SendEmailArgs<T extends SendArgsSurface = SendArgsSurface > = {
  recipient: Partial<User>
  isNew?: boolean
} & Partial<SendArgsRequest<T>>

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

  async serveSend(args: SendEmailArgs, _meta: EndpointMeta): Promise<EndpointResponse<EmailResponse> & { emailVars: EmailVars }> {
    const fictionEmail = this.fictionEmailActions?.settings.fictionEmail
    if (!fictionEmail || !this.fictionEmailActions)
      throw abort('no fictionEmail provided')

    const emailVars = await createEmailVars({ ...args, fictionEmailActions: this.fictionEmailActions, actionId: this.settings.actionId })

    const userEmail = await this.settings.emailConfig(emailVars)
    const defaultEmail = await this.defaultConfig()
    const finalEmail = deepMerge([defaultEmail, userEmail])

    const r = await fictionEmail.sendTransactional(finalEmail)

    return { ...r, emailVars }
  }

  async requestSend(args: T['sendArgs']): Promise<T['sendResponse']> {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { to } = args || {}

    if (!to)
      throw abort('no email recipient provided')

    const r = await this.fictionEmailActions?.requests.EmailAction.request({ _action: 'sendEmail', actionId: this.settings.actionId, origin, to, ...args })

    return r as T['sendResponse']
  }
}
