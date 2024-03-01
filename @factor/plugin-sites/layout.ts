import { FactorObject, toLabel, vue } from '@factor/api'
import type { ComponentCardUserConfig, ComponentConstructor } from './type-utils'

type LayoutSettings<T extends ComponentConstructor = ComponentConstructor> = {
  el: T
  layoutId: string
  title?: string
  userConfig?: ComponentCardUserConfig<T>
}
export class Layout<T extends ComponentConstructor = ComponentConstructor> extends FactorObject<LayoutSettings<T>> {
  title = this.settings.title || toLabel(this.settings.layoutId)
  el = this.settings.el
  layoutId = this.settings.layoutId
  userConfig = vue.ref(this.settings.userConfig)
  constructor(settings: LayoutSettings<T>) {
    super('Layout', settings)
  }

  toConfig() {
    return {
      title: this.title,
      layoutId: this.layoutId,
      userConfig: this.userConfig.value,
    }
  }
}
