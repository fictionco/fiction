import type { FictionEnv } from '../plugin-env'
import { abort } from './error'

export function getFromAddress(args: { name?: string, email?: string, fictionEnv?: FictionEnv }): string {
  const { fictionEnv } = args
  const app = fictionEnv?.meta.app || {}
  const { name = app.name, email = app.email } = args

  const result = name ? `${name ?? ''} <${email}>` : email

  if (!result)
    throw abort('missing from email', { data: { name, email } })

  return result
}
