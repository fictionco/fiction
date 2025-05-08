import type { Site } from '../site'

export async function getCardCompletion<T extends Record<string, unknown> = Record<string, unknown>>(args: { site: Site, runPrompt: string, outputFormat?: Record<string, unknown> }) {
  const { site, runPrompt, outputFormat } = args

  const objectives = {}
  const fictionEnv = site.fictionSites.settings.fictionEnv
  try {
    if (!objectives || !outputFormat)
      throw new Error(' objectives required')

    const result = await site.fictionSites.settings.fictionAi?.requests.QueryAi.projectRequest({
      _action: 'completion',
      format: 'websiteCopy',
      objectives,
      prompt: runPrompt,
      schemaJson: outputFormat,
    })

    if (result?.status === 'success' && result.data?.completion)
      return result.data.completion as T

    else
      fictionEnv.events.emit('notify', { type: 'error', message: 'Error getting AI completion' })
  }
  catch (e) {
    fictionEnv.events.emit('notify', { type: 'error', message: `Error getting AI completion (${(e as Error).message})` })
  }
}
