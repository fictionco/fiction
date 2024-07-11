<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { FontEntry } from '@fiction/core/utils/fonts'
import { safeStacks } from '@fiction/core/utils/fonts'
import InputSelect from './InputSelectCustom.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
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
      return {
        name: `${family} `,
        desc: category,
        value: family,
        isGoogleFont: true,
      }
    },
  )

  return [
    { format: 'title', name: 'Defaults' },
    ...safeStackItems,
    { format: 'title', name: 'Google Fonts' },
    ...glist.sort((a, b) => a.name.localeCompare(b.name)),
  ]
})

vue.onMounted(async () => {
  const { fonts } = await import('@fiction/core/utils/lib/fonts')

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
        class="font-preview text-sm py-2 px-8 inline-block bg-theme-50 dark:bg-theme-700/70 rounded-md focus:outline-none focus:ring-0 text-theme-500 dark:text-theme-300"
        :style="{ fontFamily }"
      >
        <span>Editable Font Preview</span>
      </div>
    </div>
    <InputSelect v-bind="{ ...$attrs, list }" :model-value="modelValue" class="grow" @update:model-value="emit('update:modelValue', $event as string)" />
  </div>
</template>
