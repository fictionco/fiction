<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaItem } from '@fiction/core'
import ElImage from '@fiction/ui/ElImage.vue'
import type { Card } from '../../card'

export type UserConfig = {
  items?: MediaItem[]
  label?: string
  format?: 'inline' | 'stacked'
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})
</script>

<template>
  <div>
    <div class="content-standard p-4 text-center md:p-0">
      <div
        class="items-center"
        :class="uc.format === 'stacked' ? 'block' : 'md:inline-flex md:space-x-14'"
      >
        <div
          class="x-font-title text-theme-400 dark:text-theme-600"
          :class="
            uc.format === 'stacked'
              ? 'text-xl mb-16 font-medium'
              : 'text-sm font-semibold'
          "
        >
          {{ uc.label }}
        </div>
        <div
          class="items-center gap-y-10 text-center md:gap-x-12"
          :class="
            uc.format === 'stacked'
              ? `flex justify-center flex-wrap`
              : 'flex-col md:flex-row flex align-middle justify-center md:inline-flex'
          "
        >
          <a
            v-for="(logo, i) in uc.items"
            :key="i"
            :href="logo.href"
            class="hover:text-theme-500 logo-link  flex items-center justify-center h-[80px] w-full max-w-[200px] relative"
            :class="uc.format === 'stacked' ? `w-[17%]` : ''"
            target="_blank"
          >
            <ElImage :media="logo.media" class="aspect-[2/1] min-h-0 h-full" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.logo-link > * {
  max-width: 100%;
}
</style>
