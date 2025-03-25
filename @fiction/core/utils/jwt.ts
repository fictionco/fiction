import type { TokenFields, User } from '../plugin-user'
import jwt from 'jsonwebtoken'
import { log } from '../plugin-log'
import { getCookie, removeCookieNakedDomain, setCookieNakedDomain } from './cookie'
import { abort } from './error'

const logger = log.contextLogger('JWT UTILS')

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7

export function createUserToken(args: { user: Partial<User>, tokenSecret?: string, expiresIn?: number, verifyEmail?: boolean }): string {
  const { user, tokenSecret, expiresIn = WEEK_IN_SECONDS, verifyEmail = false } = args

  if (!tokenSecret)
    throw abort('tokenSecret is not set', { code: 'TOKEN_ERROR' })

  const { systemRole = '', userId, email } = user
  // expiresIn is in seconds
  const options = typeof expiresIn !== 'undefined' ? { expiresIn } : undefined

  return jwt.sign({ systemRole, userId, email, verifyEmail }, tokenSecret, options)
}

/**
 * This is a security mechanism to prevent session jacking.
 * For session sharing, tokens are sent to sites for users visiting requesting domain... if hacker wants to session jack,
 * they could get this token, but would have to get a user to visit their domain before the token expires.
 */
export function createRenderToken(args: { renderedAt?: string, tokenSecret?: string, expiresIn?: number }): string {
  const { renderedAt = Date.now().toString(), tokenSecret = '', expiresIn = 60 * 3 } = args

  if (!tokenSecret)
    throw abort('tokenSecret is not available for renderToken')

  return jwt.sign({ renderedAt }, tokenSecret, { expiresIn })
}

/**
 * Take a JWT token and decode into the associated user _id
 */
export function decodeUserToken(args: { token: string, tokenSecret?: string }): TokenFields {
  const { token, tokenSecret } = args
  if (!tokenSecret)
    throw abort('tokenSecret is not set', { code: 'TOKEN_ERROR' })

  let r: TokenFields
  try {
    r = jwt.verify(token, tokenSecret) as TokenFields
  }
  catch (e) {
    const err = e as Error
    throw abort(`token verification failed (${err.message})`, { code: 'TOKEN_ERROR' })
  }

  if (!r.userId || !r.email)
    throw abort('token missing userId or email', { code: 'TOKEN_ERROR' })

  return r
}

export function manageClientUserToken(args: { _action?: 'set' | 'get' | 'destroy', key: string, token?: string }): string | undefined {
  const { _action = 'get', key, token } = args

  if (typeof window === 'undefined') {
    if (_action === 'get')
      return
    logger.warn('cannot set JWT token in browser (no window)', { data: args })
    return
  }

  if (_action === 'destroy') {
    removeCookieNakedDomain({ name: key })
  }
  else if (_action === 'set' && token) {
    setCookieNakedDomain({ name: key, value: token, attributes: { expires: 14, sameSite: 'Lax' } })
  }
  else {
    const cookieValue = getCookie(key)

    return cookieValue || ''
  }
}
