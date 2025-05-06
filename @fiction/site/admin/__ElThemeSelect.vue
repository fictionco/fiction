<script lang="ts" setup>
import type { Card, FictionSites } from '../index.js'
import { useService, vue } from '@fiction/core/index.js'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { getThemePreviewUrl } from '../utils/demo.js'

const { modelValue = '', card } = defineProps<{
  modelValue?: string
  card: Card
}>()

const emit = defineEmits(['update:modelValue'])

const validEl = vue.ref<HTMLInputElement>()

const isValid = vue.computed(() => !!modelValue)

const { fictionSites } = useService<{ fictionSites: FictionSites }>()

const themes = vue.computed(() => {
  return fictionSites.themes.value.filter(theme => theme.settings.isPublic)
})

vue.onMounted(() => {
  vue.watch(
    () => modelValue,
    (val) => {
      const el = validEl.value
      el?.setCustomValidity(!val ? 'Please select a theme' : '')
    },
    { immediate: true },
  )
})

function toggleSelected(themeId: string) {
  if (modelValue === themeId) {
    emit('update:modelValue', '')
    return
  }

  emit('update:modelValue', themeId)
}
</script>

<template>
  <div class="relative mt-6 mb-12 antialiased " :data-is-valid="isValid ? 'yes' : 'no'">
    <div class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8" @click="emit('update:modelValue', '')">
      <div
        v-for="(theme, i) in themes"
        :key="i"
        class="relative space-y-4 cursor-pointer screen rounded-lg group   transition-all  select-none dark:ring-offset-theme-900 aspect-[3/4] ring-4 ring-offset-4 border border-theme-200/70 dark:border-theme-600/50"
        :class="modelValue === theme.themeId ? 'ring-primary-500' : 'ring-theme-200/0 dark:ring-theme-700/0 hover:ring-primary-400'"

        :data-test-id="`theme-${theme.themeId}`"
        :data-test-index="i"
        @click.stop="toggleSelected(theme.themeId)"
      >
        <div>
          <img :src="theme.settings.screenshots?.dark?.desktop" class="pointer-events-none shadow-xl rounded-lg object-cover absolute object-top h-full w-full">
        </div>
        <div
          class="absolute bottom-0 p-3 text-white mt-4 w-full rounded-b-lg  transition-all origin-bottom flex flex-col gap-3 items-center grow justify-between "
          :class="modelValue === theme.themeId ? 'bg-primary-800/90' : 'bg-black/90 '"
        >
          <div class="space-y-1 pointer-events-none w-full">
            <div class="font-bold text-sm">
              {{ theme.title }}
            </div>
            <div class="text-xs opacity-80 leading-tight line-clamp-2">
              {{ theme.settings.description }}
            </div>
          </div>
          <div class="flex justify-between items-center gap-3 w-full">
            <XButton
              theme="overlay"
              design="outline"
              size="xs"
              @click.stop.prevent="toggleSelected(theme.themeId)"
            >
              {{ modelValue === theme.themeId ? 'Selected!' : 'Select' }}
            </XButton>
            <XButton
              theme="overlay"
              design="outline"
              size="xs"
              :href="getThemePreviewUrl({ site: card.site, themeId: theme.themeId })"
              target="_blank"
              icon="i-tabler-eye"
              @click.stop
            >
              Preview
            </XButton>
          </div>
        </div>
      </div>
    </div>
    <!-- For validation -->
    <input
      ref="validEl"
      class="max-w-input pointer-events-none float-left h-0 w-full p-0 opacity-0"
      type="text"
      :value="modelValue"
    >
  </div>
</template>
