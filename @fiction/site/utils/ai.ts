import type { Site } from '../site'

export async function getCardCompletion<T extends Record<string, unknown> = Record<string, unknown>>(args: { site: Site, runPrompt: string, outputFormat?: Record<string, unknown> }) {
  const { site, runPrompt, outputFormat } = args

  const { baseInstruction, objectives } = site.fullConfig.value.ai || {}
  const fictionEnv = site.fictionSites.settings.fictionEnv
  try {
    if (!baseInstruction || !objectives)
      throw new Error('baseInstruction and objectives required')

    const result = await site.fictionSites.settings.fictionAi?.requests.AiCompletion.projectRequest({
      _action: 'completion',
      baseInstruction,
      objectives,
      runPrompt,
      outputFormat,
    })

    if (result?.status === 'success' && result.data?.completion)
      return result.data.completion as T

    else
      fictionEnv.events.emit('notify', { type: 'error', message: 'Error getting AI completion' })
  }
  catch (e) {
    fictionEnv.events.emit('notify', { type: 'error', message: 'Error getting AI completion' })
  }
}
