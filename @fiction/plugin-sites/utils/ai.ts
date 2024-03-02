import { notify } from '@fiction/core'
import type { Site } from '../site'

export async function getCardCompletion<T extends Record<string, unknown> = Record<string, unknown>>(args: { site: Site, runPrompt: string, outputFormat?: Record<string, unknown> }) {
  const { site, runPrompt, outputFormat } = args

  const { baseInstruction, objectives } = site.userConfigWithTheme.value

  try {
    if (!baseInstruction || !objectives)
      throw new Error('baseInstruction and objectives required')

    const result = await site.factorSites.settings.factorAi?.requests.AiCompletion.projectRequest({
      _action: 'completion',
      baseInstruction,
      objectives,
      runPrompt,
      outputFormat,
    })

    if (result?.status === 'success' && result.data?.completion)
      return result.data.completion as T

    else
      notify.error('Error getting AI completion', { data: { result, args } })
  }
  catch (e) {
    notify.error('Error getting AI completion', { data: { error: e, args } })
  }
}
