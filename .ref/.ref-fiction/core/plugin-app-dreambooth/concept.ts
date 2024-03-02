// @unocss-include
import { FactorObject, vue } from '@factor/api'
import type { Model } from '../plugin-models/model'
import { MultiImageHandler } from '../ui/image-upload/handler'
import { regularizationThemes } from './lib'
import type { ConceptConfig } from './types'

export type PortableConcept = ConceptConfig & {
  fileRecord?: Record<string, File>
}

export type ConceptSettings = PortableConcept & {
  model: Model
}

export class Concept extends FactorObject<ConceptSettings> {
  model = this.settings.model
  conceptId = this.settings.conceptId || this.utils.objectId()

  instanceToken = vue.ref(
    this.settings.instanceToken || this.utils.shortId(5, false),
  )

  classToken = vue.ref(this.settings.classToken)
  classCategory = vue.ref(this.settings.classCategory)
  instancePrompt = vue.computed(
    () => `a photo of ${this.instanceToken.value} ${this.classToken.value}`,
  )

  classPrompt = vue.computed(() => `a photo of a ${this.classToken.value}`)
  instanceDataZipUrl = vue.ref(this.settings.instanceDataZipUrl)
  classDataZipUrl = vue.ref(this.settings.classDataZipUrl)
  meta = this.settings.meta || {}
  instanceImageHandler = new MultiImageHandler({
    fileRecord: this.settings.fileRecord,
  })

  loadingImages = vue.ref(false)
  isCustomClass = vue.computed(() => this.classCategory.value === 'custom')

  constructor(settings: ConceptSettings) {
    super('Concept', settings)

    this.loadFromZip().catch(console.error)

    this.utils.vue.watch(
      () => this.classCategory.value,
      (val) => {
        this.loadTheme(val)
      },
      { immediate: true },
    )
  }

  async loadFromZip() {
    if (typeof window === 'undefined')
      return

    if (this.instanceDataZipUrl.value) {
      this.loadingImages.value = true
      await this.instanceImageHandler.addFilesFromZipUrl(
        this.instanceDataZipUrl.value,
      )
      this.loadingImages.value = false
    }
  }

  loadTheme(val?: string) {
    if (!val)
      return
    const theme = regularizationThemes.find(c => c.value === val)

    if (theme) {
      this.classToken.value = theme.conceptConfig.classToken
      this.classDataZipUrl.value = theme.conceptConfig.classDataZipUrl
    }
  }

  toConfig(): ConceptConfig {
    return {
      conceptId: this.conceptId,
      classToken: this.classToken.value,
      classCategory: this.classCategory.value,
      instanceToken: this.instanceToken.value,
      instancePrompt: this.instancePrompt.value,
      classPrompt: this.classPrompt.value,
      instanceDataZipUrl: this.instanceDataZipUrl.value,
      classDataZipUrl: this.classDataZipUrl.value,
      meta: this.meta,
    }
  }

  toPortable(args: { mode?: 'zip' | 'record' } = {}): PortableConcept {
    const { mode = 'zip' } = args

    const config = this.toConfig()

    /**
     * If mode is record, then only preserved files in ui from filerecord
     * If both are kept then it can add both the files from zip and ui, which can be redundant
     * However, when adding concept, its preferable to just duplicate whats there instead of consider zip
     */
    if (mode === 'record') {
      delete config.instanceDataZipUrl
      config.fileRecord = this.instanceImageHandler.fileRecord
    }

    return config
  }
}
