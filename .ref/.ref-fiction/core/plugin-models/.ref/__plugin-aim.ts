import type {
  FactorPluginSettings,
} from '@factor/api'
import {
  FactorPlugin,
  deepMergeAll,
  vue,
} from '@factor/api'
import { InputOption } from '@kaption/core/utils/inputOption'
import handlebars from 'handlebars'
import type { FictionModel } from '..'
import type { Model, Render } from './model'
import type {
  EntryConfig,
  FictionModelTemplate,
  ModelConfigReplicate,
  ModelConfigSettings,
  RenderOutput,
} from './templates'
import type { RenderConfig, RenderInputConfig } from './tables'
import ElPromptSelect from './el/ElPromptSelect.vue'

export type FictionReplicateSettings = {
  fictionModel: FictionModel
  apiKey?: string
  modelTemplate: FictionModelTemplate
} & FactorPluginSettings

export class FictionAim extends FactorPlugin<FictionReplicateSettings> {
  fictionModel = this.settings.fictionModel
  apiKey = this.settings.apiKey
  modelTemplate = this.settings.modelTemplate
  constructor(settings: FictionReplicateSettings) {
    super('FictionReplicate', settings)
  }

  async getReplicateGetModelDetails(args: {
    replicateModelId: string
  }): Promise<ModelConfigReplicate> {
    const { replicateModelId } = args
    const response = await fetch(
      `https://dreambooth-api-experimental.replicate.com/v1/trainings/${replicateModelId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.apiKey}`,
        },
        method: 'GET',
      },
    )
    const json = (await response.json()) as {
      id: string
      input: {
        instance_prompt: string
        class_prompt: string
        instance_data: string
        max_train_steps: number
      }
      model: string
      status: 'succeeded'
      webhook_completed: string
      version: string
    }

    return {
      replicateModelId: json.id,
      replicateModelVersion: json.version,
      replicateStatus: json.status,
      replicateModelName: json.model,
    }
  }

  replicateDreamboothRenderUi = (args: {
    render: Render
  }): EntryConfig<RenderInputConfig> => {
    const { render } = args
    return vue.computed(() => {
      const modelConfig = render.model.trainUi.value?.config

      if (!modelConfig)
        throw new Error('no modelConfig')

      const config = deepMergeAll([
        {
          guidanceScale: 7.5,
          numInferenceSteps: 100,
        },
        render.renderConfig?.value || {},
        modelConfig,
      ]) as RenderInputConfig

      this.log.info('config', { data: config })

      const showAdvanced = config.showAdvanced || false

      const options: InputOption<string>[] = [
        new InputOption({
          optionKey: 'promptTemplate',
          label: 'Prompt Templates',
          description:
            'Select from a pre-defined prompt template or create your own.',
          input: ElPromptSelect,
          props: vue.computed(() => {
            return {
              prompts: [], // this.modelTemplate.promptList,
            }
          }),
        }),
        new InputOption({
          optionKey: 'prompt',
          label: 'Prompt',
          description:
            'Describe the picture you\'d like to see. Use [SUBJECT] to reference training subject.',
          input: 'InputTextarea',
        }),

        new InputOption({
          optionKey: 'aspect',
          label: 'Aspect Ratio',
          description:
            'What aspect ratio should the image be? This will affect the size of the image.',
          input: 'InputSelectCustom',
          props: vue.computed(() => {
            return {
              list: [
                {
                  name: 'Square',
                  desc: '512x512',
                  value: 'square',
                  isDefault: true,
                },
                { name: 'Portrait', desc: '512x768', value: 'portrait' },
                { name: 'Landscape', desc: '768x512', value: 'landscape' },
                { name: 'Wide', desc: '1024x512', value: 'wide' },
                { name: 'Tall', desc: '512x1024', value: 'tall' },
              ],
            }
          }),
        }),
        new InputOption({
          optionKey: 'numOutputs',
          label: 'Images per Render',
          description:
            'How many images should be generated per render? The more images, the longer it will take.',
          input: 'InputSelectCustom',
          props: vue.computed(() => {
            return {
              list: [
                { name: '1 Image', value: 1 },
                { name: '2 Images', value: 2 },
                { name: '4 Images', value: 4, isDefault: true },
                { name: '8 Images', value: 8 },
                { name: '12 Images', value: 12 },
              ],
            }
          }),
        }),
        new InputOption({
          optionKey: 'showAdvanced',
          label: 'Show Refining Options',
          input: 'InputToggle',
        }),
        new InputOption({
          optionKey: 'negativePrompt',
          label: 'Negative Prompt',
          description:
            'What would you like to avoid? The AI will use this to generate a new image.',
          input: 'InputTextarea',
          isVisible: vue.computed(() => showAdvanced),
        }),
        new InputOption({
          optionKey: 'numInferenceSteps',
          label: 'Denoising Steps',
          description:
            'Each step successfully denoises images. Too many steps might not fully diffuse, too many steps can issues with detail.',
          input: 'InputRange',

          props: vue.computed(() => {
            return {
              defaultValue: 50,
              min: 1,
              max: 500,
            }
          }),
          isVisible: vue.computed(() => showAdvanced),
        }),
        new InputOption({
          optionKey: 'guidanceScale',
          label: 'Guidance Scale',
          description:
            'Guidance can increase the quality of the image, at the cost of diversity of results.',
          input: 'InputRange',

          props: vue.computed(() => {
            return {
              defaultValue: 7.5,
              min: 1,
              max: 20,
              step: 0.5,
            }
          }),
          isVisible: vue.computed(() => showAdvanced),
        }),
        new InputOption({
          optionKey: 'seed',
          label: 'Seed',
          description:
            'A seed can be used to generate the same image every time. Leave blank to generate a new image each time.',
          input: 'InputText',
          props: vue.computed(() => {
            return {
              placeholder: '1234',
            }
          }),
          isVisible: vue.computed(() => showAdvanced),
        }),
      ]

      config.prompt = handlebars.compile(config.prompt ?? '')(config)
      config.negativePrompt = handlebars.compile(config.negativePrompt ?? '')(
        config,
      )

      return { options, config }
    })
  }

  getDimensions(aspect: 'square' | 'portrait' | 'landscape' | 'wide' | 'tall') {
    switch (aspect) {
      case 'square': {
        return { width: 512, height: 512 }
      }
      case 'portrait': {
        return { width: 512, height: 768 }
      }
      case 'landscape': {
        return { width: 768, height: 512 }
      }
      case 'wide': {
        return { width: 1024, height: 512 }
      }
      case 'tall': {
        return { width: 512, height: 1024 }
      }
    }
  }

  async replicateDreamboothPredict(args: {
    render: Render
  }): Promise<RenderOutput> {
    const { render } = args

    const config = render.renderUi.value?.config as RenderConfig

    if (!config)
      throw new Error('no config')

    const replicateModelId = render.model.templateConfig.value.replicateModelId

    if (!replicateModelId)
      throw new Error('no replicateModelId')

    const { width, height } = this.getDimensions(config.aspect)

    const input = {
      prompt: config.prompt,
      seed: config.seed,
      num_outputs: config.numOutputs,
      num_inference_steps: config.numInferenceSteps,
      guidance_scale: config.guidanceScale,
      width,
      height,
    }

    this.log.info('running prediction', { data: input })

    return {
      output: [],
      status: 'ready',
    }
  }

  async dreamboothTrain(args: { model: Model }): Promise<ModelConfigSettings> {
    const { model } = args

    const config = model.trainUi.value?.config

    if (!config)
      throw new Error('no config')

    return config
  }
}
