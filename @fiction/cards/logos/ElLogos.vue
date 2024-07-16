<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaItem } from '@fiction/core'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { Card } from '@fiction/site'

export type UserConfig = {
  items?: MediaItem[]
  label?: string
  layout?: 'inline' | 'stacked'
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

function getInlineLogoCols() {
  const items = uc.value.items || []
  const noItems = items.length
  if (noItems === 1)
    return 'md:grid-cols-1'
  else if (noItems === 2)
    return 'md:grid-cols-2'
  if (noItems === 3)
    return 'md:grid-cols-3'
  if (noItems === 4)
    return 'md:grid-cols-4'
  else
    return 'grid-cols-5'
}
</script>

<template>
  <div>
    <div class="content-standard p-4 text-center md:p-0">
      <div
        class="items-center"
        :class="uc.layout === 'stacked' ? 'block' : 'inline-flex flex-col md:flex-row md:space-x-14'"
      >
        <div
          class="x-font-title text-theme-400 dark:text-theme-600 text-balance"
          :class="
            uc.layout === 'stacked'
              ? 'text-xl mb-16 font-medium'
              : 'text-sm font-semibold max-w-40 text-right'
          "
        >
          {{ uc.label }}
        </div>
        <div
          class="items-center gap-y-10 text-center md:gap-x-12"
          :class="
            uc.layout === 'stacked'
              ? `flex justify-center flex-wrap`
              : `grid grid-cols-1 ${getInlineLogoCols()}`
          "
        >
          <a
            v-for="(logo, i) in uc.items"
            :key="i"
            :href="logo.href"
            class=" logo-link inline-flex items-center justify-center h-[80px] w-full max-w-[200px] relative"
            :class="[uc.layout === 'stacked' ? `w-[17%]` : '', logo.href ? 'cursor-pointer hover:scale-125 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.33,1)]' : '']"

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
