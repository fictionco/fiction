<script lang="ts" setup>
import type { MediaItem, vue } from '@factor/api'

export interface SectionProps {
  items?: MediaItem[]
  label?: string
  format?: 'inline' | 'stacked'
}

defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})
</script>

<template>
  <div class="content-standard p-4 text-center md:p-0">
    <div
      class="items-center"
      :class="settings.format === 'stacked' ? 'block' : 'inline-flex space-x-14'"
    >
      <div
        class="ui-font-title"
        :class="
          settings.format === 'stacked'
            ? 'text-xl mb-16 font-medium'
            : 'text-sm font-semibold'
        "
      >
        {{ settings.label }}
      </div>
      <div
        class="items-center gap-y-10 text-center md:gap-x-[3%]"
        :class="
          settings.format === 'stacked'
            ? `flex justify-center flex-wrap`
            : 'md:inline-flex'
        "
      >
        <a
          v-for="(logo, i) in settings.items"
          :key="i"
          :href="logo.href"
          class="hover:text-theme-500 logo-link  flex items-center justify-center"
          :class="settings.format === 'stacked' ? `w-[17%]` : ''"
          target="_blank"
          v-html="logo.media?.html"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.logo-link > * {
  max-width: 100%;
}
</style>
