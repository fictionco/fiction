import { EmailAction, vue } from '@fiction/core'
import type { FictionAdmin } from '..'

export function getEmails(args: { fictionAdmin: FictionAdmin }) {
  const { fictionAdmin } = args
  const fictionEmailActions = fictionAdmin.settings.fictionEmailActions
  const verifyEmailAction = new EmailAction({
    actionId: 'verify-email',
    template: vue.defineAsyncComponent(() => import('./EmailVerify.vue')),
    fictionEmailActions,
    emailConfig: (vars) => {
      return {
        subject: `${vars.appName}: Verify Your Email`,
        heading: 'Verify Your Email',
        subHeading: 'Click the Link Below',
        bodyMarkdown: `Verify your email using the code: **${vars.code}** or click the button below.`,
        to: `${vars.email}`,
        actions: [
          {
            name: 'Verify Email',
            href: vars.callbackUrl,
            btn: 'primary',
          },
        ],
      }
    },
  })
  return { verifyEmailAction }
}
