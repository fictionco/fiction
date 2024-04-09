import { FictionObject, setNested, toLabel, vue } from '@fiction/core'
import type { InputOption, InputOptionGeneration } from '@fiction/ui'
import { getOptionJsonSchema } from '@fiction/ui'
import { getCardCompletion } from './utils/ai'
import { getGenerationInputConfig } from './utils/generation'
import type { Card } from '.'

type CardGenerationSettings = {
  card: Card
}

export type CardGenerationConfig = {
  prompt?: string
  totalEstimatedTime?: number
  userInputConfig?: Record<string, InputOptionGeneration>
}

export class CardGeneration extends FictionObject<CardGenerationSettings> {
  constructor(settings: CardGenerationSettings) {
    super('CardGeneration', settings)
  }

  card = this.settings.card
  savedSettings = this.card.settings.generation || {}
  tpl = vue.computed(() => this.card.tpl.value)
  site = this.card.site

  defaultInputConfig = vue.computed(() => getGenerationInputConfig(this.tpl.value?.settings.options || []))

  defaultPrompt = vue.computed(() => {
    const c = this.card

    const p = this.site?.currentPage?.value
    const pageName = p?.title.value ? `on the "${p.title.value}" page` : ''
    return `create content for the "${c?.title.value || toLabel(c?.templateId.value)}" card ${pageName}`
  })

  userPrompt = vue.ref(this.savedSettings.prompt || '')
  prompt = vue.computed(() => this.userPrompt.value || this.defaultPrompt.value)
  userInputConfig = vue.ref< Record<string, InputOptionGeneration>>(this.savedSettings.userInputConfig || {})

  inputConfig = vue.computed(() => {
    const out: Record<string, InputOptionGeneration> = {}
    let cumulativeTime = 0
    const userInputConfig = this.userInputConfig.value
    this.defaultInputConfig.value.forEach((opt) => {
      const o = { ...opt, ...userInputConfig[opt.key] }

      if (!o.isDisabled)
        cumulativeTime += o.estimatedMs

      out[opt.key] = { ...o, cumulativeTime }
    })

    return out
  })

  totalEstimatedTime = vue.computed(() => {
    const total = Object.values(this.inputConfig.value).filter(_ => !_.isDisabled).reduce((acc, opt) => {
      const time = opt.estimatedMs ?? 3000
      return acc + time
    }, 0)
    return Math.round(total / 1000)
  })

  progress = vue.ref({ percent: 0, status: '' })

  private simulateProgress() {
    this.progress.value = { percent: 0, status: `Initializing...` }
    const timeStart = Date.now()
    const totalEstimatedTime = this.totalEstimatedTime.value

    const interval = 500

    // this stops iteration for cases when error occurs
    let completed = false

    const updateProgress = () => {
      const timeElapsed = Date.now() - timeStart
      const percent = Math.round(Math.min((timeElapsed / (totalEstimatedTime * 1000)) * 100, 100))
      const currentSetting = Object.values(this.inputConfig.value).find(_ => !_.isDisabled && _.cumulativeTime && timeElapsed <= _.cumulativeTime)

      this.progress.value = {
        percent,
        status: `Generating ${currentSetting?.label || ''}`,
      }

      if (percent < 100 && !completed)
        setTimeout(updateProgress, interval)

      else
        this.progress.value = { percent: 100, status: `Wrapping up...` }
    }

    updateProgress()

    return {
      complete: () => {
        completed = true
        this.progress.value = { percent: 100, status: `Complete!` }
      },
    }
  }

  async getCompletion() {
    if (!this.site || !this.tpl.value)
      throw new Error('site and template required')

    const jsonSchema = getOptionJsonSchema(this.tpl.value.settings.options, this.inputConfig.value)

    const completionArgs = { runPrompt: this.prompt.value, outputFormat: jsonSchema, site: this.site }

    this.log.info('RUNNING COMPLETION', { data: completionArgs })

    const progress = this.simulateProgress()

    try {
      const c = await getCardCompletion(completionArgs)

      progress.complete()

      this.log.info('COMPLETION RESULT', { data: c })

      if (c) {
        let data = this.card.toConfig()

        Object.entries(c).forEach(([key, value]) => {
          const path = `userConfig.${key}`
          data = setNested({ path, data, value, isMerge: true })
        })

        this.card.update(data)
      }

      return c
    }
    finally {
      progress.complete()
    }
  }

  toConfig(): CardGenerationConfig {
    const config = {
      prompt: this.prompt.value,
      totalEstimatedTime: this.totalEstimatedTime.value,
      userInputConfig: this.userInputConfig.value,
    }

    return config
  }
}
