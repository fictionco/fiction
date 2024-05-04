<script lang="ts" setup>
import ElButton from '@fiction/ui/ElButton.vue'
import { vue } from '@fiction/core'
import type { ActionItem, MediaItem } from '@fiction/core'
import type { Card } from '@fiction/site'

export type UserConfig = {
  heading?: string
  subHeading?: string
  items: MediaItem[]
  actions: ActionItem[]
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
  <div :class="card.classes.value.contentWidth">
    <div class="mb-6 md:mb-24 text-center md:text-left md:flex items-end gap-4 justify-center">
      <div
        class="x-font-title max-w-full text-4xl font-bold tracking-tighter sm:text-6xl lg:text-8xl text-balance"
        v-html="uc.heading"
      />
      <div
        class="text-xl lg:text-3xl lg:leading-snug w-full text-balance mt-4 lg:max-w-sm"
        v-html="uc.subHeading"
      />
    </div>
    <div class=" md:grid-cols-3 gap-8 md:gap-20 text-center md:text-left hidden md:grid ">
      <div v-for="(item, i) in uc.items" :key="i">
        <div class="text-3xl font-bold x-font-title">
          {{ item.name }}
        </div>
        <div class="mt-4 text-xl text-theme-500 dark:text-theme-200">
          {{ item.desc }}
        </div>
      </div>
    </div>
    <div class="mt-6 md:mt-24 flex items-center justify-center gap-x-6">
      <ElButton
        v-for="(action, i) in uc.actions"
        :key="i"
        :btn="action.btn || 'primary'"
        :href="action.href"
        :size="action.size || 'xl'"
      >
        {{ action.name }}
      </ElButton>
    </div>
  </div>
</template>
