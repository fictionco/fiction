import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import type { Card } from './index.js'
import type { InputOptionGeneration, ProgressState } from './utils/generation.js'

import { FictionObject, setNested, toLabel, vue } from '@fiction/core'
import zodToJsonSchema from 'zod-to-json-schema'
import { getCardCompletion } from './utils/ai.js'
import { calculateTotalEstimatedTimeSeconds, generateJsonPropConfig, generateOutputProps, simulateProgress } from './utils/generation.js'

type CardGenerationSettings = {
  card: Card
}

export type CardGenerationConfig = {
  prompt?: string
  totalEstimatedTime?: number
  userPropConfig?: Record<string, InputOptionGeneration | undefined>
}

export class CardGeneration extends FictionObject<CardGenerationSettings> {
  card = this.settings.card
  savedSettings = this.card.settings.generation || {}
  aiUserConfig = vue.computed(() => this.card.userConfig.value.standard?.ai || {})

  fieldsUserConfig = vue.computed({
    get: () => this.aiUserConfig.value.fields || {},
    set: (v) => {
      this.card.updateUserConfig({ path: 'standard.ai.fields', value: v })
    },
  })

  constructor(settings: CardGenerationSettings) {
    super('CardGeneration', settings)
  }

  tpl = vue.computed(() => this.card.tpl.value)
  site = this.card.site
  jsonSchema = vue.computed(() => {
    if (!this.tpl.value?.settings?.schema)
      return undefined

    const schema = this.tpl.value.settings.schema
    const jsonSchema = zodToJsonSchema(schema) as JsonSchema7ObjectType

    return jsonSchema
  })

  jsonPropConfig = vue.computed(() => generateJsonPropConfig({ jsonSchema: this.jsonSchema.value, userPropConfig: this.fieldsUserConfig.value }))
  outputProps = vue.computed(() => generateOutputProps({ jsonSchema: this.jsonSchema.value, jsonPropConfig: this.jsonPropConfig.value }))

  outputSchema = vue.computed(() => {
    const fullSchema = { ...this.jsonSchema.value }

    if (!fullSchema)
      return undefined

    fullSchema.properties = this.outputProps.value || {}

    return fullSchema
  })

  defaultPrompt = vue.computed(() => {
    const c = this.card

    return `create content for the "${c?.title.value || toLabel(c?.templateId.value)}" card`
  })

  userPrompt = vue.ref(this.savedSettings.prompt || '')
  prompt = vue.computed(() => this.userPrompt.value || this.defaultPrompt.value)

  totalEstimatedTime = vue.computed(() => calculateTotalEstimatedTimeSeconds({ jsonPropConfig: this.jsonPropConfig.value }))

  progress = vue.ref<ProgressState>({ percent: 0, status: '' })

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

    const progress = simulateProgress({
      totalEstimatedTime: this.totalEstimatedTime.value,
      jsonPropConfig: this.jsonPropConfig.value,
      updateProgress: (state: ProgressState) => (this.progress.value = state),
    })

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
}
