import jwt from 'jsonwebtoken'
import { log } from '../plugin-log'
import { getCookie, removeCookie, setCookie } from './cookie'
import { abort } from './error'
import type { TokenFields, User } from '../plugin-user'

const logger = log.contextLogger('JWT UTILS')

export function createUserToken(args: { user: Partial<User>, tokenSecret?: string, expiresIn?: string | number, verifyEmail?: boolean }): string {
  const { user, tokenSecret, expiresIn, verifyEmail = false } = args

  if (!tokenSecret)
    throw abort('tokenSecret is not set', { code: 'TOKEN_ERROR' })

  const { role = '', userId, email } = user
  const options = expiresIn ? { expiresIn } : undefined
  return jwt.sign({ role, userId, email, verifyEmail }, tokenSecret, options)
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
    logger.warn('browser functions not available, set client token', { data: args })
    return
  }

  if (_action === 'destroy') {
    removeCookie({ name: key })
  }
  else if (_action === 'set' && token) {
    setCookie({ name: key, value: token, attributes: { expires: 14, sameSite: 'Lax' } })
  }
  else {
    const cookieValue = getCookie(key)

    return cookieValue || ''
  }
}
