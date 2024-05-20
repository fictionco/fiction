import type { FictionDb } from '@fiction/core/plugin-db'
import { standardTable } from '@fiction/core/tbl'
import { abort } from '../../utils/error'
import { dayjs } from '../../utils/libraries'
import type { FictionUser, User } from '..'
import { validateEmail } from '../../utils/utils'

function getSixDigitRandom(): string {
  return Math.random().toString().slice(2, 8)
}

export async function setUserVerificationCode(params: { fictionUser: FictionUser, email: string, userId?: string }): Promise<User | undefined> {
  const { email, userId, fictionUser } = params

  if (!email)
    throw abort('no email provided to send code to')

  const code = getSixDigitRandom()
  const fields = {
    verificationCode: code,
    codeExpiresAt: dayjs().add(1, 'day').toISOString(),
  }

  const userIdField = userId ? { userId } : { email }

  const result = await fictionUser.queries.ManageUser.serve({ _action: 'update', ...userIdField, fields }, { server: true })

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
    .select<{ verificationCode: string, codeExpiresAt: string }[]>([
      'verificationCode',
      'codeExpiresAt',
    ])
    .from(standardTable.user)
    .where(where)

  const storedCode = r && r.length > 0 ? r[0] : undefined

  // allow short circuit in development
  if (!isProd && verificationCode === 'test')
    return true

  if (!storedCode || storedCode.verificationCode !== verificationCode)
    throw abort(`verification code is not a match (${isProd ? 'prod' : 'dev'})`, { data: !isProd ? { storedCode, verificationCode } : {} })

  else if (!storedCode.codeExpiresAt || dayjs().isAfter(storedCode.codeExpiresAt))
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
    { _action: 'getPublic', email: email.toLowerCase().trim() },
    { server: true },
  )

  if (user?.userId)
    throw abort(`verifyEmail: email ${email} already exists`, { data: { email, user } })

  return true
}
