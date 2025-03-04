<script lang="ts" setup>
import type { FontFamily, StandardSize } from '@fiction/core'
import type { FontEntry } from '@fiction/core/utils/lib/fontList'
import { groupBy, vue } from '@fiction/core'
import { safeStacks } from '@fiction/core/utils/fonts'
import InputSelectCustom from './InputSelectCustom.vue'

defineOptions({ name: 'InputFont' })

const { modelValue = {}, uiSize = 'md', noPreview = false } = defineProps<{
  modelValue?: FontFamily
  uiSize?: StandardSize
  noPreview?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: FontFamily): void
}>()

const fontsList = vue.ref<FontEntry[]>()

function getGoogleLink(family: string) {
  return `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800;900`
}

async function requestFontsList() {
  const { getFontList } = await import('@fiction/core/utils/lib/fontList')
  const fonts = await getFontList()
  return fonts
}

const list = vue.computed(() => {
  const safeStackItems = Object.entries(safeStacks).map(([key, stack]) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: key,
    }
  })

  const fonts = groupBy(fontsList.value || [], 'category') as Record<string, FontEntry[]>

  const categories: FontEntry['category'][] = [
    'sans-serif',
    'serif',
    'handwriting',
    'display',
    'monospace',
  ]

  const glist = categories.flatMap(
    (category) => {
      const entries = fonts[category] || []
      const vals = entries.map((entry) => {
        const { family, reason } = entry

        return {
          label: family,
          subLabel: [category, reason].filter(Boolean).join(', '),
          value: family,
          source: 'google',
        }
      })
      return [{ format: 'title', name: category }, ...vals]
    },
  )

  return [
    { name: 'Default', value: '' },
    ...glist,
    { format: 'title', name: 'Native Fonts' },
    ...safeStackItems,
  ]
})

vue.onMounted(async () => {
  fontsList.value = await requestFontsList()
})

vue.watch(() => modelValue, async (newFont) => {
  const list = await requestFontsList()
  const fontItem = list.find(font => font.family === newFont.family)

  if (fontItem) {
    const link = getGoogleLink(fontItem.family)
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
}, { immediate: true })

const fontFamily = vue.computed(() => {
  const selectedFont = modelValue.family || ''
  return safeStacks[selectedFont as keyof typeof safeStacks] || selectedFont
})

function handleFamilyChange(family?: string) {
  emit('update:modelValue', { family })
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="space-y-2">
    <InputSelectCustom
      v-bind="{ ...$attrs, list }"
      :ui-size="uiSize"
      :model-value="modelValue.family"
      class="grow"
      @update:model-value="handleFamilyChange($event as string | undefined)"
    />
    <div v-if="fontFamily && !noPreview">
      <div
        contenteditable="true"
        class="w-full py-1 px-4 text-sm font-preview inline-block border border-dashed dark:bg-theme-700/60 text-center border-theme-200 dark:border-theme-600/60 rounded-md focus:outline-none focus:ring-0  hover:opacity-80"
        :style="{ fontFamily }"
      >
        <span>Preview</span>
      </div>
    </div>
  </div>
</template>
