import { abort, toSlug } from '@fiction/core'
import { createUserToken } from '@fiction/core/utils/jwt'
import type { EmailVars, QueryVars, SendEmailArgs } from './action'
import type { FictionTransactions } from '.'

export async function createEmailVars<
T extends Record<string, string> | undefined = Record<string, string> | undefined,
>(args: SendEmailArgs & {
  actionId: string
  fictionTransactions: FictionTransactions
  queryVars?: T
}): Promise<EmailVars<T>> {
  const { actionId, recipient, origin, baseRoute = '', fictionTransactions } = args
  const { fictionApp, fictionEmail, fictionUser } = fictionTransactions?.settings || {}
  const tokenSecret = fictionUser?.settings.tokenSecret

  if (!recipient)
    throw abort('no recipient user provided')

  if (!tokenSecret)
    throw abort('no tokenSecret provided')

  const originUrl = origin || fictionApp?.appUrl.value || ''
  const cleanPath = (_: string) => _.replace(/^\/|\/$/g, '')
  const buildUrl = (...parts: string[]) => parts.filter(_ => _ && _ !== '/').map(cleanPath).join('/')

  const slug = fictionTransactions.transactionSlug
  const callbackHref = buildUrl(originUrl, baseRoute, slug, toSlug(actionId))
  const unsubscribeUrl = buildUrl(originUrl, baseRoute, slug, 'unsubscribe')

  const v: QueryVars = args.queryVars || {}

  v.token = createUserToken({ user: recipient, tokenSecret, verifyEmail: true, expiresIn: '1d' })
  v.code = recipient.verify?.code || ''
  v.email = recipient.email || ''
  v.userId = recipient.userId || ''

  if (args.redirect) {
    v.redirect = args.redirect
  }

  const queryParams = new URLSearchParams(v).toString()
  const callbackUrl = `${callbackHref}?${queryParams}`
  const { fullName = '', email = '', userId = '', username = '' } = recipient || {}
  const appName = fictionEmail?.settings.fictionEnv.meta.app?.name || ''
  const code = v.code || 'NOT_PROVIDED'
  const token = v.token || ''
  const redirect = v.redirect || ''

  return { queryVars: v as T, actionId, redirect, fullName, email, userId, username, token, code, originUrl, callbackUrl, unsubscribeUrl, appName }
}
