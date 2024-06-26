import type { EndpointMeta, EndpointResponse, RequestMeta, TransactionalEmailConfig, User, vue } from '@fiction/core'
import { FictionObject, abort, deepMerge } from '@fiction/core'
import type { EmailResponse } from '@fiction/core/plugin-email/endpoint'
import { createEmailVars } from './utils'
import type { FictionTransactions } from '.'

export type QueryVars<T extends Record<string, string> | undefined = Record<string, string> | undefined> = {
  code?: string
  email?: string
  token?: string
  userId?: string
  redirect?: string
} & T

export type EmailVars<T extends Record<string, string> | undefined = Record<string, string> | undefined> = {
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
  masks?: Record<string, string | undefined>
}

type EmailConfigResponse = TransactionalEmailConfig & {
  emailVars: EmailVars
}

export type EmailActionSettings<T extends EmailActionSurface = EmailActionSurface > = {
  actionId: string
  template?: vue.Component
  emailConfig?: (args: EmailVars<T['queryVars']>) => EmailConfigResponse | Promise<EmailConfigResponse>
  vars?: Partial<EmailVars>
  serverTransaction?: (args: T['transactionArgs'] & { transaction: EmailAction }, meta: EndpointMeta) => Promise< T['transactionResponse']>
  fictionTransactions: FictionTransactions
}

export type SendArgsSurface = Partial<{
  queryVars: Record<string, string>
  fields: Record<string, unknown>
}>

export type SendArgsRequest = {
  to: string
  userId?: string
  fields?: Partial<User>
  origin?: string
  redirect?: string
  baseRoute?: string
}

// export type EmailConfigArgs<T extends Record<string, string> | undefined = Record<string, string> | undefined> =
//   SendEmailArgs & {
//     actionId: string
//     fictionTransactions: FictionTransactions
//     queryVars?: T
//   }

export type SendEmailArgs = {
  recipient: Partial<User>
  isNew?: boolean
} & Partial<SendArgsRequest>

export type EmailActionSurface = Partial<{
  transactionArgs: Record<string, unknown>
  transactionResponse: EndpointResponse
  queryVars: Record<string, string>
  sendResponse: EndpointResponse<{ recipient: User }>
}>

// Utility type to merge two types
type MergeTypes<T, U> = T & Omit<U, keyof T>

// Use defaults
type Surface<T> = MergeTypes<EmailActionSurface, T>

export class EmailAction<T extends EmailActionSurface = EmailActionSurface > extends FictionObject<EmailActionSettings<T>> {
  fictionTransactions = this.settings.fictionTransactions
  queryVars?: T['queryVars'] // type helper for inference in components

  constructor(params: EmailActionSettings<T>) {
    super(`EmailAction:${params.actionId}`, params)

    this.install()
  }

  install() {
    this.fictionTransactions.emailActions[this.settings.actionId] = this as unknown as EmailAction
  }

  async requestTransaction(args: T['transactionArgs'], meta?: RequestMeta): Promise<T['transactionResponse']> {
    const r = await this.fictionTransactions?.requests.EmailAction.request({ _action: 'serverTransaction', actionId: this.settings.actionId, ...args }, meta)

    return r
  }

  async defaultConfig(): Promise<TransactionalEmailConfig> {
    const fictionTransactions = this.fictionTransactions
    const fictionMedia = fictionTransactions?.settings.fictionMedia
    const fictionEmail = fictionTransactions?.settings.fictionEmail
    const fictionEnv = fictionTransactions?.settings.fictionEnv

    if (!fictionMedia)
      throw abort('no fictionMedia provided')

    const emailImages = fictionEmail?.emailImages()
    const superImage = await fictionMedia.relativeMedia({ url: emailImages?.icon || '' })
    const footerImage = await fictionMedia.relativeMedia({ url: emailImages?.footer || '' })
    const app = fictionEnv?.meta.app || {}
    return {
      fromName: app.name || '',
      fromEmail: app.email || '',
      mediaSuper: {
        media: { url: superImage.url },
        name: 'Fiction',
        href: `https://www.fiction.com`,
      },
      mediaFooter: {
        media: { url: footerImage.url },
        name: 'Personal Marketing Platform',
        href: `https://www.fiction.com`,
      },
    }
  }

  async serveSend(args: SendEmailArgs & { queryVars: T['queryVars'] }, meta: EndpointMeta): Promise<EndpointResponse<EmailResponse> & { emailVars: EmailVars }> {
    const fictionEmail = this.fictionTransactions?.settings.fictionEmail
    if (!fictionEmail || !this.fictionTransactions)
      throw abort('no fictionEmail provided')

    const emailVars = await createEmailVars<T['queryVars']>({ ...args, fictionTransactions: this.fictionTransactions, actionId: this.settings.actionId })

    if (!this.settings.emailConfig) {
      throw abort('no emailConfig provided')
    }

    const emailConfig = await this.settings.emailConfig(emailVars)

    const defaultEmail = await this.defaultConfig()
    const finalEmail = deepMerge([defaultEmail, emailConfig])
    const r = await fictionEmail.sendTransactional(finalEmail, meta)

    return { ...r, emailVars: emailConfig.emailVars || emailVars }
  }

  async requestSend(args: SendArgsRequest & { queryVars: T['queryVars'] }): Promise<Surface<T>['sendResponse']> {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { to } = args || {}

    if (!to)
      throw abort('no email recipient provided')

    const r = await this.fictionTransactions?.requests.EmailAction.request({ ...args, _action: 'sendEmail', actionId: this.settings.actionId, origin, to })

    return r as T['sendResponse']
  }
}
