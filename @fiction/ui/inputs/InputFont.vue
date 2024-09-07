<script lang="ts" setup>
import { vue } from '@fiction/core'
import { safeStacks } from '@fiction/core/utils/fonts'
import type { StandardSize } from '@fiction/core'
import type { FontEntry } from '@fiction/core/utils/fonts'
import InputSelectCustom from './InputSelectCustom.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

interface FontItem {
  family: string
  variants: string[]
  category: string
}

const fontsList = vue.ref<FontEntry[]>()

function getGoogleLink(family: string, variants: string[]) {
  return `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${variants.join(',')}`
}

const list = vue.computed(() => {
  const safeStackItems = Object.entries(safeStacks).map(([key, stack]) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      desc: `Default ${key}`,
      value: key,
    }
  })

  const fonts = fontsList.value || []
  const glist = fonts.map(
    ({ family, variants, category }: FontItem) => {
      return { name: `${family} (${category})`, value: family, isGoogleFont: true }
    },
  )

  return [
    { format: 'title', name: 'Google Fonts' },
    ...glist.sort((a, b) => a.name.localeCompare(b.name)),
    { format: 'title', name: 'Defaults' },
    ...safeStackItems,
  ]
})

vue.onMounted(async () => {
  const { fonts } = await import('@fiction/core/utils/lib/fontList')

  fontsList.value = fonts as FontEntry[]
})

vue.watch(() => props.modelValue, (newFont) => {
  const fontItem = fontsList.value?.find(font => font.family === newFont)
  if (fontItem && fontItem.variants.length > 0) {
    const link = getGoogleLink(fontItem.family, fontItem.variants)
    const fontLink = document.getElementById('google-font-preview') as HTMLLinkElement
    if (fontLink) {
      fontLink.href = link
    }
    else {
      const newFontLink = document.createElement('link')
      newFontLink.id = 'google-font-preview'
      newFontLink.rel = 'stylesheet'
      newFontLink.href = link
      document.head.appendChild(newFontLink)
    }
  }
})

const fontFamily = vue.computed(() => {
  const selectedFont = props.modelValue || ''
  return safeStacks[selectedFont as keyof typeof safeStacks] || selectedFont
})

const previewFontSize = vue.computed(() => {
  const sizes = {
    'xxs': 'text-xs p-2',
    'xs': 'text-sm p-2',
    'sm': 'text-base p-2',
    'md': 'text-lg py-2 px-8',
    'lg': 'text-xl py-2.5 px-8',
    'xl': 'text-2xl py-3 px-8',
    '2xl': 'text-3xl py-3.5 px-8',
  }
  return sizes[props.uiSize as keyof typeof sizes] || 'text-base py-2 px-8'
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="space-y-2">
    <div v-if="fontFamily">
      <div
        contenteditable="true"
        class="font-preview inline-block border border-dashed border-theme-200 dark:border-theme-600/60 rounded-md focus:outline-none focus:ring-0  hover:opacity-80"
        :class="previewFontSize"
        :style="{ fontFamily }"
      >
        <span>Editable Font Preview </span>
      </div>
    </div>
    <InputSelectCustom v-bind="{ ...$attrs, list }" :ui-size="uiSize" :model-value="modelValue" class="grow" @update:model-value="emit('update:modelValue', $event as string)" />
  </div>
</template>
