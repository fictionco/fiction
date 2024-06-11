import type { vue } from '../utils/libraries.js'
import type { ListItem } from './utils.js'

export interface TemplateConfig {
  name?: string
  slug: string
  value?: string
  component: () => Promise<any>
  fields?: TemplateSetting[]
}

export interface TemplateSetting {
  input?: string
  label?: string
  _id: string
  _default?: string | Record<string, any>[]
  description?: string
  settings?: TemplateSetting[]
  list?: string[] | ListItem[]
}

export interface EngineSectionEntry<
  T extends Record<string, any> = Record<string, any>,
> {
  sectionId?: string
  el?: vue.Component
  classes?: string
  settings?: T
}

export interface EngineViewEntry<
  T extends Record<string, any> = Record<string, unknown>,
  U extends Record<string, any> = Record<string, any>,
> {
  viewId?: string
  icon?: string
  name?: string
  el?: vue.Component
  layout?: EngineSectionEntry<U>[]
  userConfig?: T
}
