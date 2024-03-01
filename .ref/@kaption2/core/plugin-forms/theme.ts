import { FactorObject } from '@factor/api'

export interface ThemeConfig {
  variants: string[]
}

export class FormTheme extends FactorObject<ThemeConfig> {
  constructor(settings: ThemeConfig) {
    super('FormTheme', settings)
  }
}
