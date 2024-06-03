import { FictionAws, FictionMedia, type ServiceConfig, vue } from '@fiction/core'
import { createTestUtils } from '@fiction/core/test-utils'
import { getEnvVars } from '@fiction/core'
import { EmailAction, FictionEmailActions } from '..'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const mainFilePath = new URL(import.meta.url).pathname
  const testUtils = createTestUtils({ mainFilePath, ...args }) as ReturnType<typeof createTestUtils> & { emailAction: EmailAction }

  const v = getEnvVars(testUtils.fictionEnv, ['AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'AWS_BUCKET_MEDIA'] as const)

  const { awsAccessKey, awsAccessKeySecret, awsBucketMedia } = v

  const fictionAws = new FictionAws({ ...testUtils, awsAccessKey, awsAccessKeySecret })
  const fictionMedia = new FictionMedia({ ...testUtils, fictionAws, awsBucketMedia })
  const fictionEmailActions = new FictionEmailActions({ ...testUtils, fictionMedia })

  const service = { ...testUtils, fictionAws, fictionMedia, fictionEmailActions }
  const actionId = 'testAction'

  service.emailAction = new EmailAction({
    actionId,
    template: vue.defineAsyncComponent(() => import('./ElTestAction.vue')),
    fictionEmailActions,
    emailConfig: async (emailVars) => {
      const emailConfig = {
        emailVars,
        subject: `${emailVars.appName}: Email Action Subject`,
        heading: 'Email Action Heading',
        subHeading: 'Email Action Subheading',
        bodyMarkdown: `Email Action Body Markdown`,
        to: `${emailVars.email}`,
        actions: [
          {
            name: 'Verify Email',
            href: emailVars.callbackUrl,
            btn: 'primary' as const,
          },
        ],
      }

      return emailConfig
    },
  })

  return {
    service,
    runVars: {},
    runCommand: async args => service.runApp(args),
    createMount: args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
