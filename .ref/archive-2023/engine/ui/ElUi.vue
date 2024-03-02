<script lang="ts" setup>
import { useService, vue } from '@factor/api'
import type { FactorEngine, UiConfig } from '..'

const props = defineProps({
  ui: { type: String as vue.PropType<keyof UiConfig>, required: true },
})

const { factorEngine } = useService<{ factorEngine: FactorEngine }>()

const el = vue.computed(() => {
  const config = factorEngine.getUi({ ui: props.ui })
  return config?.el
})
</script>

<template>
  <component :is="el">
    <slot />
  </component>
</template>
