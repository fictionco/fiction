<script lang="ts" setup>
import type { FictionSites } from '../index.js'
import { useService, vue } from '@fiction/core/index.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const validationInput = vue.ref<HTMLInputElement>()

const { fictionSites } = useService<{ fictionSites: FictionSites }>()

const themes = vue.computed(() => {
  return fictionSites.themes.value.filter(theme => theme.settings.isPublic)
})

vue.onMounted(() => {
  vue.watch(
    () => props.modelValue,
    (val) => {
      const el = validationInput.value
      el?.setCustomValidity(!val ? 'Please select a theme' : '')
    },
    { immediate: true },
  )
})
</script>

<template>
  <div class="relative my-6">
    <div class="grid grid-cols-2 gap-12" @click="emit('update:modelValue', '')">
      <div v-for="(theme, i) in themes" :key="i">
        <div
          class="screen rounded-lg group relative transition-all cursor-pointer ring-offset-4  select-none"
          :class="modelValue === theme.themeId ? 'ring-4 ring-primary-500  dark:ring-offset-theme-800' : 'ring-0 hover:ring-4 hover:ring-primary-300'"
          :data-test-id="`theme-${theme.themeId}`"
          :data-test-index="i"
          @click.stop="emit('update:modelValue', theme.themeId)"
        >
          <img :src="theme.settings.screenshot" class="pointer-events-none shadow-xl rounded-lg">
        </div>
        <div class="mt-4 w-full rounded-b-lg  transition-all origin-bottom">
          <div class="">
            <div class="font-bold">
              {{ theme.settings.title }}
            </div>
            <div class="text-sm opacity-60">
              {{ theme.settings.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- For validation -->
    <input
      ref="validationInput"
      class="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 p-0 opacity-0"
      v-bind="$attrs"
      type="text"
      :value="modelValue"
    >
  </div>
</template>
