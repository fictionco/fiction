// need to generalize the case, currently can't figure out how to recreate

import type { vue } from '@fiction/core'
import type { Card } from './card.js'

// this constructor that vue doesn't export (but uses)
export interface ComponentConstructor {
  new (...args: any[]): vue.ComponentPublicInstance<Record<string, any>>
}

export type ComponentCardUserConfig<T extends ComponentConstructor = ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: { value: infer V } } } } ? V : undefined
