<script lang="ts" setup>
import ElEngine from '@factor/engine/ui/ElEngine.vue'
import type { ColorScheme } from '@factor/api'
import { getColorScheme, vue } from '@factor/api'
import type { EngineConfig } from '@factor/engine'

export interface SectionProps {
  engine?: EngineConfig
  scheme?: ColorScheme
  bg?: { color?: string }
}
const props = defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})

const theme = vue.computed(() => {
  return getColorScheme(props.settings.scheme || 'slate').colors
})

const st = vue.computed(() => {
  return { 'background-color': props.settings.bg?.color }
})
</script>

<template>
  <div class="space-lg el-area" :style="st">
    <ElEngine :config="settings.engine" class="space-y-40" />
  </div>
</template>

<style lang="less" scoped>
.el-area {
  --theme-0: v-bind("theme[0]");
  --theme-50: v-bind("theme[50]");
  --theme-100: v-bind("theme[100]");
  --theme-200: v-bind("theme[200]");
  --theme-300: v-bind("theme[300]");
  --theme-400: v-bind("theme[400]");
  --theme-500: v-bind("theme[500]");
  --theme-600: v-bind("theme[600]");
  --theme-700: v-bind("theme[700]");
  --theme-800: v-bind("theme[800]");
  --theme-900: v-bind("theme[900]");
  --theme-950: v-bind("theme[950]");
  --theme-1000: v-bind("theme[1000]");
  color: var(--theme-900);
}
</style>
