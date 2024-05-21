import type { FictionDb } from '@fiction/core/plugin-db'
import { standardTable } from '@fiction/core/tbl'
import bcrypt from 'bcrypt'
import { abort } from '../../utils/error'
import { dayjs } from '../../utils/libraries'
import type { FictionUser, User } from '..'
import { validateEmail } from '../../utils/utils'
import type { VerificationCode } from '../schema'
import type { WhereUser } from '../endpoint'

/**
 * A random 6 digit number, ideal for verification code
 */
export function getCode(): string {
  return Math.random().toString().slice(2, 8)
}
/**
 * Create a md5 of password
 * @remarks
 * 6 salt rounds - https://security.stackexchange.com/a/83382
 */
export async function hashPassword(password?: string): Promise<string | undefined> {
  return password ? await bcrypt.hash(password, 6) : undefined
}
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function setUserVerificationCode(params: { context: string, fictionUser: FictionUser, where: WhereUser }): Promise<User | undefined> {
  const { where, fictionUser, context } = params

  const code = getCode()
  const verify: VerificationCode = {
    code,
    expiresAt: dayjs().add(1, 'day').toISOString(),
    context,
  }

  const result = await fictionUser.queries.ManageUser.serve({ _action: 'update', where, fields: { verify } }, { server: true })

  const user = result.data

  return user
}

/**
 * Verify if a passed code matches the stored one
 */
export async function verifyCode(args: {
  email?: string
  userId?: string
  verificationCode: string
  fictionDb: FictionDb
  isProd?: boolean
}): Promise<true> {
  const { email, verificationCode, userId, fictionDb, isProd = true } = args

  if (!verificationCode)
    throw abort(`no code provided`)

  if (!email && !userId)
    throw abort(`need email or userId`)

  const where = userId ? { userId } : { email }

  const db = fictionDb.client()
  const r = await db
    .select<{ verify: VerificationCode }[]>(['verify'])
    .from(standardTable.user)
    .where(where)

  const row = r && r.length > 0 ? r[0] : undefined
  const verify = row?.verify

  // allow short circuit in development
  if (!isProd && verificationCode === 'test')
    return true

  if (!verify || verify.code !== verificationCode)
    throw abort(`verification code is not a match (${isProd ? 'prod' : 'dev'})`, { data: !isProd ? { verify, verificationCode } : {} })

  else if (!verify.expiresAt || dayjs().isAfter(verify.expiresAt))
    throw abort(`verification code is expired`)

  return true
}

/**
 * Verify a new user email is valid and unique
 */
export async function validateNewEmail(params: {
  email?: string
  fictionUser: FictionUser
}): Promise<true> {
  const { email, fictionUser } = params
  if (!email)
    throw abort('email is required')
  if (!validateEmail(email))
    throw abort('email failed validation')

  const { data: user } = await fictionUser.queries.ManageUser.serve(
    { _action: 'retrieve', where: { email: email.toLowerCase().trim() } },
    { server: true },
  )

  if (user?.userId)
    throw abort(`verifyEmail: email ${email} already exists`, { data: { email, user } })

  return true
}
