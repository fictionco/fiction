<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import { colorTheme, colorThemeBright, getColorScheme, onlyUserColorTheme, vue } from '@fiction/core'
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
    return [...out, ...colorThemeBright.map(color => ({
      label: color,
      value: color,
      meta: { color },
    }))]
  }
  else {
    return [
      ...out,
      ...onlyUserColorTheme.map(color => ({
        label: color,
        value: color,
        meta: { color },
      })),
      ...colorTheme.map(color => ({
        label: color,
        value: color,
        meta: { color },
      })),
    ]
  }
})

const selectedColor = vue.computed(() => {
  if (!modelValue)
    return null

  return getColorScheme(modelValue, { outputFormat: 'hex' })?.[600] || null
})
</script>

<template>
  <div>
    <InputSelectCustom
      :list="list"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event as ColorThemeUser)"
    >
      <template #selected="{ item }">
        <div class="flex items-center gap-2">
          <div
            v-if="item?.value"
            class="w-4 h-4 rounded-sm border border-theme-300 dark:border-theme-0/40"
            :style="{ background: getColorScheme(item.value as ColorThemeUser, { outputFormat: 'hex' })[600] }"
          ></div>
          <span>{{ item?.label || 'Select' }}</span>
        </div>
      </template>

      <template #option="{ item }">
        <div class="flex items-center gap-2">
          <div
            v-if="item?.value"
            class="w-4 h-4 rounded-sm border border-theme-300 dark:border-theme-0/40"
            :style="{ background: getColorScheme(item.value as ColorThemeUser, { outputFormat: 'hex' })[600] }"
          ></div>
          <span>{{ item?.label }}</span>
        </div>
      </template>

      <template #trailing>
        <div
          v-if="selectedColor"
          class="w-5 h-5 rounded-sm border border-theme-300 dark:border-theme-0/40"
          :style="{ background: selectedColor }"
        ></div>
      </template>
    </InputSelectCustom>
  </div>
</template>
