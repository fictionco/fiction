<script lang="ts" setup>
import ElUi from '@factor/engine/ui/ElUi.vue'
import type { vue } from '@factor/api'

export interface SectionProps {
  title?: string
  subTitle?: string
  badge?: string
  actions?: {
    text?: string
    href?: string
    onClick?: () => void
  }[]
}
defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})
</script>

<template>
  <div class=" ">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="mx-auto text-center">
        <h2
          v-if="settings.badge"
          class="text-theme-400 mb-6 font-sans text-sm font-medium uppercase tracking-wide"
          v-html="settings.badge"
        />
        <h1
          class="ui-font-title text-4xl font-bold tracking-tighter lg:text-7xl"
          v-html="settings.title"
        />
        <p
          class="mt-6 text-xl lg:text-3xl lg:leading-snug"
          v-html="settings.subTitle"
        />
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <ElUi
            v-for="(action, i) in settings.actions"
            :key="i"
            ui="button"
            btn="primary"
            :href="action.href"
            size="xl"
          >
            {{ action.text }}
          </ElUi>
        </div>
      </div>
    </div>
  </div>
</template>
