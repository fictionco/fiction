<script setup lang="ts">
import { useService, vue } from '@factor/api'
import type { EngineConfig, FactorEngine } from '..'

const props = defineProps({
  config: {
    type: Object as vue.PropType<EngineConfig>,
    default: undefined,
  },
  region: {
    type: String as vue.PropType<'page' | 'header' | 'footer'>,
    default: undefined,
  },
})
const { factorEngine } = useService<{ factorEngine: FactorEngine }>()
const finalConfig = vue.computed(() => {
  const out
    = props.config
    || (props.region ? factorEngine.getRegionConfig(props.region) : undefined)

  return out
})

const classes = vue.computed(() => {
  const c = finalConfig.value?.classes
  return vue.isRef(c) ? c.value : c
})

const sections = vue.computed(() => {
  const s = finalConfig.value?.sections
  const out = vue.isRef(s) ? s.value : s
  return out
})
</script>

<template>
  <div
    v-if="finalConfig?.sections"
    class="layout-engine"
    :class="classes"
  >
    <template v-if="sections && sections.length">
      <div v-for="(c, i) in sections" :key="i">
        <component
          :is="c.el"
          :section-id="c.id"
          :settings="c.settings"
          :class="c.classes"
        />
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<style lang="less">
.layout-engine {
  .edge-padding {
    @apply px-4 sm:px-6 lg:px-10;
  }
  .content-wide {
    @apply max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10;
  }
  .content-standard {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-10;
  }
  .space-md {
    margin-top: calc(2rem + 4vw);
    margin-bottom: calc(2rem + 4vw);
  }
  .space-lg {
    padding-top: calc(3rem + 6vw);
    padding-bottom: calc(3rem + 6vw);
  }
}
</style>
