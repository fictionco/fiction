import { abort, toSlug } from '@fiction/core'
import { createUserToken } from '@fiction/core/utils/jwt'
import type { EmailVars, SendEmailArgs } from './action'
import type { FictionEmailActions } from '.'

export async function createEmailVars(args: SendEmailArgs & { actionId: string, fictionEmailActions: FictionEmailActions }): Promise<EmailVars> {
  const { actionId, recipient, origin, queryVars = {}, redirect, baseRoute = '/', fictionEmailActions } = args
  const { fictionApp, fictionEmail, fictionUser } = fictionEmailActions?.settings || {}
  const tokenSecret = fictionUser?.settings.tokenSecret

  if (!recipient)
    throw abort('no recipient user provided')

  if (!tokenSecret)
    throw abort('no tokenSecret provided')

  const originUrl = origin || fictionApp?.appUrl.value || ''
  const cleanPath = (_: string) => _.replace(/^\/|\/$/g, '')
  const buildUrl = (...parts: string[]) => parts.filter(Boolean).map(cleanPath).join('/')

  const callbackHref = buildUrl(originUrl, baseRoute, '_action', toSlug(actionId))
  const unsubscribeUrl = buildUrl(originUrl, baseRoute, '_action', 'unsubscribe')

  const v: Record<string, string> = args.queryVars || {}
  if (recipient) {
    v.token = createUserToken({ user: recipient, tokenSecret })
  }

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
    originUrl,
    callbackUrl,
    unsubscribeUrl,
    appName: fictionEmail?.settings.fictionEnv.meta.app?.name || '',
    code: 'NOT_PROVIDED',
    ...queryVars,
  }
}
