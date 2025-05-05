<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import { colorTheme, colorThemeBright, getColorScheme, onlyUserColorTheme, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import InputSelectCustom from './InputSelectCustom.vue'

defineOptions({ name: 'InputColorTheme' })

const { modelValue, mode = 'user' } = defineProps<{
  modelValue?: ColorThemeUser
  mode?: 'bright' | 'user' | 'color'
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ColorThemeUser | undefined): void
}>()

const list = vue.computed(() => {
  const out = [{ label: 'Select', value: '' }]

  if (mode === 'bright') {
    return [...out, ...colorThemeBright]
  }
  else {
    return [...out, ...onlyUserColorTheme, ...colorTheme]
  }
})
const colorScheme = vue.computed(() => {
  if (!modelValue)
    return ''

  if (onlyUserColorTheme.includes(modelValue as typeof onlyUserColorTheme[number])) {
    return ''
  }

  return getColorScheme(modelValue, { outputFormat: 'hex' })
})

const showPreview = vue.ref(false)
</script>

<template>
  <div class="space-y-2">
    <InputSelectCustom
      :list
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event as ColorThemeUser)"
    />
    <div v-if="colorScheme" class="flex gap-2 items-center">
      <XButton class="shrink-0" design="link" size="xs" @click.prevent="showPreview = !showPreview">
        Show Colors
      </XButton>
      <div
        v-if="colorScheme && showPreview"
        class="flex w-full rounded-md overflow-hidden h-5 "
        :style="{ border: `1px solid ${colorScheme[500]}` }"
      >
        <div v-for="(clr, i) in colorScheme" :key="i" :title="String(i)" class="w-full" :style="{ background: clr }" />
      </div>
    </div>
  </div>
</template>
