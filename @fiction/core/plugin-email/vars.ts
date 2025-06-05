import type { MetaAppDetails } from '../plugin-env'
import type { FictionUser, User } from '../plugin-user'
import type { EmailResponse } from './endpoint'
import type { EmailSendConfig } from './util'
import { abort } from '../utils'
import { createUserToken } from '../utils/jwt'

export type EmailVarsConfig<T extends Record<string, string> = Record<string, string>> = {
  email: string
  userId?: string
  fictionUser: FictionUser
  origin?: string
  callbackPath?: string
  createUserFields?: Partial<User>
  queryVars?: T
  caller: string
}

export type EmailVars<T extends Record<string, string> = Record<string, string>> = {
  app?: MetaAppDetails
  appName: string
  code: string
  token: string
  recipient: User
  callbackUrl: string
  originUrl: string
  unsubscribeUrl: string
  redirect: string
  queryVars: T
  masks?: Record<string, string> // mask variables for snapshots in testing
  emailResponse?: EmailResponse
  caller: string
}

export type EmailConfigResponse = EmailSendConfig & { emailVars: EmailVars }

export async function createEmailVars<T extends Record<string, string> = Record<string, string>>(
  config: EmailVarsConfig<T>,
): Promise<EmailVars<T>> {
  const { email, userId, fictionUser, origin, callbackPath = '/', createUserFields, queryVars = {} as T, caller } = config
  const { fictionApp, fictionEmail, tokenSecret } = fictionUser.settings

  if (!tokenSecret)
    throw abort('Missing tokenSecret')
  if (!email)
    throw abort('Missing email')

  const recipient = await getOrCreateUser({ email, userId, fictionUser, createUserFields })
  const urls = buildUrls({ origin: origin || fictionApp?.appUrl.value || '', callbackPath })
  const authVars = createAuthVars({ recipient, tokenSecret, queryVars })

  return {
    recipient,
    app: fictionEmail?.settings.fictionEnv.meta,
    appName: fictionEmail?.settings.fictionEnv.meta?.name || '',
    code: authVars.code,
    token: authVars.token,
    callbackUrl: `${urls.callback}?${new URLSearchParams(authVars).toString()}`,
    originUrl: urls.origin,
    unsubscribeUrl: urls.unsubscribe,
    redirect: authVars.redirect || '',
    queryVars: authVars as T,
    caller,
  }
}

async function getOrCreateUser(args: {
  email: string
  userId?: string
  fictionUser: FictionUser
  createUserFields?: Partial<User>
}) {
  const { email, userId, fictionUser, createUserFields } = args

  const where = userId ? { userId } : { email }

  const response = await fictionUser.queries.ManageUser.serve({
    _action: 'getCreate',
    where,
    createUserFields,
    refreshCode: true,
  }, { server: true, returnAuthority: ['verify'] })

  if (!response?.data)
    throw abort('Failed to get or create user')
  return response.data
}

function buildUrls(args: { origin: string, callbackPath: string }) {
  const { origin, callbackPath } = args
  const cleanPath = (path: string) => path.replace(/^\/+|\/+$/g, '')
  const joinPaths = (...paths: string[]) => paths.filter(Boolean).map(cleanPath).join('/')

  return {
    origin,
    callback: joinPaths(origin, callbackPath),
    unsubscribe: joinPaths(origin, 'm', 'preferences'),
  }
}

export type CardbackQueryVars = {
  redirect?: string
  userId?: string
  email?: string
  code?: string
  token?: string
  action?: string
  tags?: string[]
  targetOrgId?: string
  [key: string]: string | string[] | undefined
}

function createAuthVars<T extends Record<string, string>>(args: {
  recipient: User
  tokenSecret: string
  queryVars: T
}) {
  const { recipient, tokenSecret, queryVars } = args

  return {
    ...queryVars,
    token: createUserToken({
      user: recipient,
      tokenSecret,
      verifyEmail: true,
      expiresIn: 60 * 60 * 24 * 2,
    }),
    code: recipient.verify?.code || '',
    email: recipient.email || '',
    userId: recipient.userId || '',
    redirect: queryVars.redirect || '',
  }
}
