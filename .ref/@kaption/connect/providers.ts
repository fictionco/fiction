import { ConnectSlack } from './connect-slack'
import { ConnectGoogleSheets } from './connect-google-sheets'
import type { IntegrationClientDetail } from './connection'

export * from './connection'

const providers = {
  googleSheets: ConnectGoogleSheets,
  slack: ConnectSlack,
}

export type ProviderKeys = keyof typeof providers

export function getProvider(args: IntegrationClientDetail & { provider: ProviderKeys }) {
  const { projectId, provider } = args

  if (!projectId)
    throw new Error('No projectId provided')

  const providerClass = providers[provider]

  if (!providerClass)
    throw new Error(`provider (${args.provider}) not found`)

  return new providerClass(args)
}
