import { FictionAws, FictionMedia, type ServiceConfig, type ServiceList, vue } from '@fiction/core'
import { createTestUtils } from '@fiction/core/test-utils'
import { getEnvVars } from '@fiction/core'
import { EmailAction, FictionEmailActions } from '..'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const { context = 'node' } = args
  const mainFilePath = new URL(import.meta.url).pathname
  const testUtils = createTestUtils({ mainFilePath, ...args })

  const v = getEnvVars(testUtils.fictionEnv, ['AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'AWS_BUCKET_MEDIA'] as const)

  const { awsAccessKey, awsAccessKeySecret, awsBucketMedia } = v

  const fictionAws = new FictionAws({ ...testUtils, awsAccessKey, awsAccessKeySecret })
  const fictionMedia = new FictionMedia({ ...testUtils, fictionAws, awsBucketMedia })

  const fictionEmailActions = new FictionEmailActions({ ...testUtils, fictionMedia })

  const service = {
    ...testUtils,
    fictionAws,
    fictionMedia,
    fictionEmailActions,
  }
  const actionId = 'test-action'
  const heading = 'Verify Your Email'
  const action = new EmailAction({
    actionId,
    template: vue.defineAsyncComponent(() => import('./ElTestAction.vue')),
    fictionEmailActions,
    emailConfig: (vars) => {
      return {
        subject: `${vars.appName}: Verify Your Email`,
        heading,
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

  return {
    service,
    runVars: {},
    runCommand: async args => service.runApp(args),
    createMount: args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
