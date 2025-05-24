import type { MetaAppDetails } from '../plugin-env'
import type { FictionUser, User } from '../plugin-user'
import type { EmailSendConfig } from './util'
import { abort } from '../utils'
import { createUserToken } from '../utils/jwt'

export type EmailVarsConfig<T extends Record<string, string> = Record<string, string>> = {
  email: string
  fictionUser: FictionUser
  origin?: string
  callbackPath?: string
  createUserFields?: Partial<User>
  queryVars?: T
}

export type EmailVars<T extends Record<string, string> = Record<string, string>> = {
  app?: MetaAppDetails
  appName: string
  code: string
  token: string
  email: string
  userId: string
  fullName: string
  handle: string
  callbackUrl: string
  originUrl: string
  unsubscribeUrl: string
  redirect: string
  queryVars: T
}

export type EmailConfigResponse = EmailSendConfig & { emailVars: EmailVars }

export async function createEmailVars<T extends Record<string, string> = Record<string, string>>(
  config: EmailVarsConfig<T>,
): Promise<EmailVars<T>> {
  const { email, fictionUser, origin, callbackPath = '/', createUserFields, queryVars = {} as T } = config
  const { fictionApp, fictionEmail, tokenSecret } = fictionUser.settings

  if (!tokenSecret)
    throw abort('Missing tokenSecret')
  if (!email)
    throw abort('Missing email')

  const recipient = await getOrCreateUser({ email, fictionUser, createUserFields })
  const urls = buildUrls({ origin: origin || fictionApp?.appUrl.value || '', callbackPath })
  const authVars = createAuthVars({ recipient, tokenSecret, queryVars })

  return {
    app: fictionEmail?.settings.fictionEnv.meta,
    appName: fictionEmail?.settings.fictionEnv.meta?.name || '',
    code: authVars.code,
    token: authVars.token,
    email: recipient.email || '',
    userId: recipient.userId || '',
    fullName: recipient.fullName || '',
    handle: recipient.handle || '',
    callbackUrl: `${urls.callback}?${new URLSearchParams(authVars).toString()}`,
    originUrl: urls.origin,
    unsubscribeUrl: urls.unsubscribe,
    redirect: authVars.redirect || '',
    queryVars: authVars as T,
  }
}

async function getOrCreateUser(args: {
  email: string
  fictionUser: FictionUser
  createUserFields?: Partial<User>
}) {
  const { email, fictionUser, createUserFields } = args

  const response = await fictionUser.queries.ManageUser.serve({
    _action: 'getCreate',
    where: { email },
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
  const joinPaths = (...paths: string[]) =>
    paths.filter(Boolean).map(cleanPath).join('/')

  return {
    origin,
    callback: joinPaths(origin, callbackPath),
    unsubscribe: joinPaths(origin, '__contact', 'preferences'),
  }
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
