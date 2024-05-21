import { FictionAws, FictionMedia, type ServiceConfig, type ServiceList } from '@fiction/core'
import { createTestUtils } from '@fiction/core/test-utils'
import { FictionEmailActions } from '..'

export async function setup(args: { context?: 'node' | 'app' } = {}): Promise<ServiceConfig> {
  const mainFilePath = new URL(import.meta.url).pathname
  const testUtils = createTestUtils({ mainFilePath, ...args })

  const awsAccessKey = testUtils.fictionEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = testUtils.fictionEnv.var('AWS_ACCESS_KEY_SECRET')

  if (!awsAccessKey || !awsAccessKeySecret)
    throw new Error(`missing env vars key:${awsAccessKey?.length}, secret:${awsAccessKeySecret?.length}`)

  const fictionAws = new FictionAws({ ...testUtils, awsAccessKey, awsAccessKeySecret })
  const fictionMedia = new FictionMedia({ ...testUtils, fictionAws, bucket: 'factor-tests' })

  const fictionEmailActions = new FictionEmailActions({ ...testUtils, fictionMedia })

  const service = {
    ...testUtils,
    fictionAws,
    fictionMedia,
    fictionEmailActions,
  }

  return {
    service,
    fictionEnv: service.fictionEnv,
    runCommand: async args => service.runApp(args),
    createService: async () => service as ServiceList,
    createMount: args => service.fictionApp.mountApp(args),
  }
}
