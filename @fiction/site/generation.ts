import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import type { Card } from './index.js'
import type { InputOptionGeneration, ProgressState } from './utils/generation.js'

import { FictionObject, setNested, toLabel, vue } from '@fiction/core'
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
  // jsonSchema = vue.computed(() => {
  //   if (!this.tpl.value?.settings?.schema)
  //     return undefined

  //   const schema = this.tpl.value.settings.schema
  //   const jsonSchema = zodToJsonSchema(schema) as JsonSchema7ObjectType

  //   return jsonSchema
  // })

  // jsonPropConfig = vue.computed(() => generateJsonPropConfig({ jsonSchema: this.jsonSchema.value, userPropConfig: this.fieldsUserConfig.value }))
  // outputProps = vue.computed(() => generateOutputProps({ jsonSchema: this.jsonSchema.value, jsonPropConfig: this.jsonPropConfig.value }))

  // outputSchema = vue.computed(() => {
  //   const fullSchema = { ...this.jsonSchema.value }

  //   if (!fullSchema)
  //     return undefined

  //   fullSchema.properties = this.outputProps.value || {}

  //   return fullSchema
  // })

  async getJsonPropConfig() {
    const jsonSchema = await this.getJsonSchema()
    return generateJsonPropConfig({ jsonSchema, userPropConfig: this.fieldsUserConfig.value })
  }

  async getJsonSchema() {
    const config = await this.tpl.value?.getConfig?.({ site: this.site })
    const { default: zodToJsonSchema } = await import('zod-to-json-schema')
    return config?.schema ? zodToJsonSchema(config?.schema) as JsonSchema7ObjectType : undefined
  }

  async getOutputProps() {
    const jsonSchema = await this.getJsonSchema()
    const jsonPropConfig = await this.getJsonPropConfig()
    return generateOutputProps({ jsonSchema, jsonPropConfig })
  }

  async getOutputSchema() {
    const jsonSchema = await this.getJsonSchema()
    if (!jsonSchema)
      return undefined

    jsonSchema.properties = await this.getOutputProps()

    return jsonSchema
  }

  async getTotalEstimatedTime() {
    const jsonPropConfig = await this.getJsonPropConfig()
    return calculateTotalEstimatedTimeSeconds({ jsonPropConfig })
  }

  async getConfig() {
    return {
      jsonPropConfig: await this.getJsonPropConfig(),
      outputProps: await this.getOutputProps(),
      outputSchema: await this.getOutputSchema(),
      totalEstimatedTime: await this.getTotalEstimatedTime(),
    }
  }

  defaultPrompt = vue.computed(() => {
    const c = this.card

    return `create content for the "${c?.title.value || toLabel(c?.templateId.value)}" website section`
  })

  userPrompt = vue.ref(this.savedSettings.prompt || '')
  prompt = vue.computed(() => this.userPrompt.value || this.defaultPrompt.value)

  // totalEstimatedTime = vue.computed(() => calculateTotalEstimatedTimeSeconds({ jsonPropConfig: this.jsonPropConfig.value }))

  progress = vue.ref<ProgressState>({ percent: 0, status: '' })

  applyChanges(c?: Record<string, any>) {
    if (c) {
      let data = this.card.toConfig()

      Object.entries(c).forEach(([key, value]) => {
        const path = `userConfig.${key}`
        data = setNested({ path, data, value, isMerge: true })
      })

      this.card.update(data, { caller: 'applyChanges' })
    }
  }

  async getCompletion() {
    if (!this.site || !this.tpl.value)
      throw new Error('site and template required')

    const { jsonPropConfig, outputProps, outputSchema, totalEstimatedTime } = await this.getConfig()

    if (!outputSchema)
      throw new Error('missing schema')

    if (!Object.keys(outputProps).length)
      throw new Error('no fields to generate')

    const completionArgs = { runPrompt: this.prompt.value, outputFormat: outputSchema, site: this.site }

    this.log.info('RUNNING COMPLETION', { data: completionArgs })

    const progress = simulateProgress({
      totalEstimatedTime,
      jsonPropConfig,
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
