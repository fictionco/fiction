import type { RenderConfig } from '../tables'

export type ModelMeta = {
  instanceDataFileSize?: number
  classDataFileSize?: number
  imageCount?: number
  sampleImageUrls?: string[]
}

export interface ModelConfigSettings {
  learningRate?: number
  seed?: number
  resolution?: number
  maxTrainSteps?: number
  trainingHandling?: 'createNew' | 'retrain'
  [key: string]: unknown // needed for v-model
}

export interface ConceptConfig {
  conceptId?: string
  conceptThemeId?: string
  classToken?: string
  classCategory?: string
  instanceToken?: string
  instancePrompt?: string
  classPrompt?: string
  instanceDataZipUrl?: string
  classDataZipUrl?: string
  meta?: ModelMeta
  fileRecord?: Record<string, File>
}

export type Prompt = {
  value: string
  name: string
  description?: string
  renderConfig: Partial<RenderConfig>

  category: 'art' | 'movie' | 'cyberpunk'
  type: 'avatar' | 'product'
  images?: string[]
}

export type RegularizationTheme = {
  value: string
  name: string
  description?: string
  conceptConfig: Partial<ConceptConfig>
  type: 'avatar' | 'product' | 'animal'
}
