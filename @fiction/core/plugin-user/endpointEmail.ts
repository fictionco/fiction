import type { EmailSendConfig } from '../plugin-email'
import type { EmailVars } from '../plugin-email/vars'
import type { EndpointResponse } from '../types'
import type { EndpointMeta } from '../utils'
import type { FictionUser, User } from './index.js'
import { createEmailVars } from '../plugin-email/vars'
import { abort } from '../utils'
import { UserBaseQuery } from './endpoint'

type EmailAction = 'verifyEmail' | 'passwordReset' | 'oneTimeCode' | 'verifySubscribe'

export type ManageUserEmailParams = {
  _action: EmailAction
  userId?: string
  email: string
  targetOrgId?: string
  tags?: string[]
  queryVars?: Record<string, string>
  createUserFields?: Partial<User>
  caller: string
}

type UserEmailArgs = ManageUserEmailParams & {
  fictionUser: FictionUser
}

export type ManageUserEmailResponse = EndpointResponse<EmailVars>

export class ManageUserEmail extends UserBaseQuery {
  async run(params: ManageUserEmailParams, meta: EndpointMeta): Promise<ManageUserEmailResponse> {
    try {
      const result = await sendUserEmail({ ...params, fictionUser: this.settings.fictionUser }, meta)

      return { status: 'success', data: result }
    }
    catch (error) {
      this.log.error('Failed to send email', { data: { params, error } })
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }
}

export async function sendUserEmail(args: UserEmailArgs, meta: EndpointMeta) {
  const { _action, email, userId, fictionUser, targetOrgId, tags, queryVars = {}, createUserFields, caller } = args

  const fictionEmail = fictionUser.settings.fictionEmail
  if (!fictionEmail)
    throw abort('fictionEmail not configured')

  const org = targetOrgId ? await getOrganization(targetOrgId, fictionUser) : undefined

  const emailVars = await createEmailVars({
    email,
    userId,
    fictionUser,
    callbackPath: 'm',
    queryVars: {
      ...queryVars,
      action: _action,
      ...(targetOrgId && { targetOrgId }),
      ...(tags?.length && { tags: tags.join(',') }),
    },
    createUserFields,
    caller,
  })

  const config = getEmailConfig(_action, emailVars, org)

  const r = await fictionEmail.renderAndSendEmail({
    ...await fictionEmail.defaultEmailConfig(),
    ...config,
    to: email,
  }, { caller: _action, ...meta })

  emailVars.emailResponse = r.data

  return emailVars
}

async function getOrganization(orgId: string, fictionUser: FictionUser) {
  const response = await fictionUser.queries.ManageOrganization.serve(
    { _action: 'read', where: { orgId } },
    { server: true, caller: 'subscribe' },
  )
  if (!response.data)
    throw abort('Organization not found')
  return response.data
}

function getEmailConfig(_action: EmailAction, vars: EmailVars, org?: any) {
  const { appName, code, callbackUrl } = vars
  const orgName = org?.orgName || appName
  const btn = (label: string) => [{ label, href: callbackUrl, theme: 'primary' as const }]

  const emails: Record<EmailAction, Omit<EmailSendConfig, 'caller' | 'to'>> = {
    verifyEmail: {
      subject: `${appName}: Verify Your Email`,
      title: 'Verify Your Email',
      subTitle: 'Confirm your account to get started',
      content: `Your verification code is: <strong>${code}</strong><br><br>You can either enter this code or click the button below.`,
      buttons: btn('Verify Email'),
    },
    passwordReset: {
      subject: `${appName}: Reset your password`,
      title: 'Reset your password',
      subTitle: 'Create a new password for your account',
      content: 'We received a request to reset your password.<br><br>Click the button below to create a new password.<br><br>If you didn\'t request this, you can safely ignore this email.',
      buttons: btn('Reset Password'),
    },
    oneTimeCode: {
      subject: `${appName}: Your code is ${code}`,
      title: 'Your verification code',
      subTitle: 'Use this code to verify your account',
      content: `Verify your account with this code:<br><br><h2>${code}</h2>`,
    },
    verifySubscribe: {
      subject: `${orgName}: Confirm your subscription`,
      title: 'Confirm Your Subscription',
      subTitle: 'Just click to complete',
      content: `Click the button to confirm you'd like to follow <strong>${orgName}</strong>.`,
      buttons: btn('Confirm'),
      senderName: orgName,
      senderEmail: org?.orgEmail,
      superTitle: org && { text: orgName, icon: org.avatar },
    },
  }

  return { ...vars, ...emails[_action], emailType: 'alert' as const }
}
