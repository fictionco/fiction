import type { vue } from '@factor/api'
import { FactorObject } from '@factor/api'
import type { InputOption } from '../../plugin-admin/.ref/inputOption'
import type { Model } from '../model'

export interface ModelProps {
  [key: string]: unknown
}

type ThemeEntryEl = vue.ComputedRef<{
  component: vue.Component
  props: ModelProps
  options: InputOption<string>[]
}>

export interface ModelThemeConfig {
  themeId: string
  el: (model: Model) => ThemeEntryEl
}

export class ModelTheme extends FactorObject<ModelThemeConfig> {
  themeId = this.settings.themeId
  el = this.settings.el
  constructor(settings: ModelThemeConfig) {
    super('ModelTheme', settings)
  }
}
