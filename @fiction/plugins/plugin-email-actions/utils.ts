import { abort, toSlug } from '@fiction/core'
import { createUserToken } from '@fiction/core/utils/jwt'
import type { EmailVars, SendEmailArgs } from './action'
import type { FictionEmailActions } from '.'

export async function createEmailVars(args: SendEmailArgs & { actionId: string, fictionEmailActions: FictionEmailActions, queryVars?: Record<string, string> }): Promise<EmailVars> {
  const { actionId, recipient, origin, queryVars = {}, redirect, baseRoute = '', fictionEmailActions } = args
  const { fictionApp, fictionEmail, fictionUser } = fictionEmailActions?.settings || {}
  const tokenSecret = fictionUser?.settings.tokenSecret

  if (!recipient)
    throw abort('no recipient user provided')

  if (!tokenSecret)
    throw abort('no tokenSecret provided')

  const originUrl = origin || fictionApp?.appUrl.value || ''
  const cleanPath = (_: string) => _.replace(/^\/|\/$/g, '')
  const buildUrl = (...parts: string[]) => parts.filter(_ => _ && _ !== '/').map(cleanPath).join('/')

  const slug = fictionEmailActions.transactionSlug
  const callbackHref = buildUrl(originUrl, baseRoute, slug, toSlug(actionId))
  const unsubscribeUrl = buildUrl(originUrl, baseRoute, slug, 'unsubscribe')

  const v: Record<string, string> = args.queryVars || {}

  v.token = createUserToken({ user: recipient, tokenSecret })
  v.code = recipient.verify?.code || ''
  v.email = recipient.email || ''

  if (redirect) {
    v.redirect = redirect
  }

  const queryParams = new URLSearchParams(v).toString()
  const callbackUrl = `${callbackHref}?${queryParams}`
  const { fullName = '', email = '', userId = '', username = '' } = recipient || {}

  return {
    actionId,
    redirect: redirect || '',
    fullName,
    email,
    userId,
    username,
    token: v.token || '',
    code: v.code || 'NOT_PROVIDED',
    originUrl,
    callbackUrl,
    unsubscribeUrl,
    appName: fictionEmail?.settings.fictionEnv.meta.app?.name || '',
    queryVars,
  }
}
