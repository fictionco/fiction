import type { vue } from '@factor/api'
import { FactorObject } from '@factor/api'
import type { ChatAgent } from './obj'

export interface ThemeConfig {
  themeId: string
  el: (agent: ChatAgent) => ThemeEntryEl
}

export interface ThemeProps {
  [key: string]: unknown
}

type ThemeEntryEl = vue.ComputedRef<{
  component: vue.Component
  props: ThemeProps
  options: []
}>

export class AgentTheme extends FactorObject<ThemeConfig> {
  themeId = this.settings.themeId
  el = this.settings.el
  constructor(settings: ThemeConfig) {
    super('AgentTheme', settings)
  }
}
