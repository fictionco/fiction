import { FictionObject, removeUndefined, setNested, toLabel, vue } from '@fiction/core'
import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import zodToJsonSchema from 'zod-to-json-schema'
import { getCardCompletion } from './utils/ai'
import { getGenerationInputConfig } from './utils/generation'
import type { Card } from '.'

type CardGenerationSettings = {
  card: Card
}

export type CardGenerationConfig = {
  prompt?: string
  totalEstimatedTime?: number
  userPropConfig?: Record<string, InputOptionGeneration | undefined>
}

export type InputOptionGeneration = {
  prompt?: string
  isEnabled?: boolean
  estimatedMs?: number
  key?: string
  label?: string
  cumulativeTime?: number
}

export class CardGeneration extends FictionObject<CardGenerationSettings> {
  card = this.settings.card
  savedSettings = this.card.settings.generation || {}
  userPropConfig = vue.ref<Record<string, InputOptionGeneration | undefined>>(this.savedSettings?.userPropConfig || {})

  constructor(settings: CardGenerationSettings) {
    super('CardGeneration', settings)


  }

  tpl = vue.computed(() => this.card.tpl.value)
  site = this.card.site
  jsonSchema = vue.computed(() => {
    if (!this.tpl.value?.settings.schema)
      return undefined

    const schema = this.tpl.value.settings.schema
    const jsonSchema = zodToJsonSchema(schema) as JsonSchema7ObjectType

    return jsonSchema
  })

  parseDescription(description: string) {
    const meta: Record<string, any> = {}
    const parts = description.split(';').map(part => part.trim())
    const desc = parts.shift() // The first part is the description

    parts.forEach((part) => {
      const [key, value] = part.split(':').map(s => s.trim())
      meta[key] = value
    })

    return { description: desc, meta }
  };

  jsonPropConfig = vue.computed(() => {
    const props = this.jsonSchema.value?.properties || {}
    let cumulativeTime = 0
    const uc = this.userPropConfig.value
    const jsonProp = Object.fromEntries(Object.entries(props).map(([key, value]) => {
      const d = this.parseDescription(value.description || '')
      const userValue = uc[key]
      const estimatedMs = +d.meta.time || 4000
      if (userValue?.isEnabled)
        cumulativeTime += estimatedMs

      return [key, { key, label: key, prompt: d.description, estimatedMs, cumulativeTime, ...userValue }]
    }))

    return jsonProp
  })

  outputProps = vue.computed(() => {
    const props = this.jsonSchema.value?.properties || {}
    const entries = Object.entries(props).map(([key, value]) => {
      const userConfig = this.jsonPropConfig.value[key]

      if (!userConfig?.isEnabled)
        return [key, undefined]

      const description = userConfig?.prompt || value.description
      return [key, { ...value, description }]
    }).filter(_ => _[1])

    return Object.fromEntries(entries)
  })

  outputSchema = vue.computed(() => {
    const fullSchema = { ...this.jsonSchema.value }

    if (!fullSchema)
      return undefined

    fullSchema.properties = this.outputProps.value || {}

    return fullSchema
  })

  defaultPrompt = vue.computed(() => {
    const c = this.card

    const p = this.site?.currentPage?.value
    const pageName = p?.title.value ? `on the "${p.title.value}" page` : ''
    return `create content for the "${c?.title.value || toLabel(c?.templateId.value)}" card ${pageName}`
  })

  userPrompt = vue.ref(this.savedSettings.prompt || '')
  prompt = vue.computed(() => this.userPrompt.value || this.defaultPrompt.value)

  totalEstimatedTime = vue.computed(() => {
    const total = Object.values(this.jsonPropConfig.value).filter(_ => _.isEnabled).reduce((acc, opt) => {
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
      const currentSetting = Object.values(this.jsonPropConfig.value).find(_ => _.isEnabled && _.cumulativeTime && timeElapsed <= _.cumulativeTime)

      this.progress.value = { percent, status: `Generating ${currentSetting?.label || ''}` }

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

  applyChanges(c?: Record<string, any>) {
    if (c) {
      let data = this.card.toConfig()

      Object.entries(c).forEach(([key, value]) => {
        const path = `userConfig.${key}`
        data = setNested({ path, data, value, isMerge: true })
      })

      this.card.update(data)
    }
  }

  async getCompletion() {
    if (!this.site || !this.tpl.value)
      throw new Error('site and template required')

    if (!this.outputSchema.value)
      throw new Error('missing schema')

    if (!Object.keys(this.outputProps.value).length)
      throw new Error('no fields to generate')

    const completionArgs = { runPrompt: this.prompt.value, outputFormat: this.outputSchema.value, site: this.site }

    this.log.info('RUNNING COMPLETION', { data: completionArgs })

    const progress = this.simulateProgress()

    try {
      const c = await getCardCompletion(completionArgs)

      progress.complete()

      this.log.info('COMPLETION RESULT', { data: c })

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
      userPropConfig: this.userPropConfig.value,
    }

    return config
  }
}
