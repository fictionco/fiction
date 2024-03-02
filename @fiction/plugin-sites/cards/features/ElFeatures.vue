<script lang="ts" setup>
import ElButton from '@fiction/ui/ElButton.vue'
import { vue } from '@fiction/core'
import type { ActionItem, MediaItem } from '@fiction/core'
import type { Card } from '../../card'

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
    <div class="mb-16 flex items-end gap-36">
      <div
        class="x-font-title w-[20em] text-4xl font-bold tracking-tighter sm:text-7xl text-balance"
        v-html="uc.heading"
      />
      <div
        class="text-lg lg:text-3xl lg:leading-snug w-full text-balance text-right"
        v-html="uc.subHeading"
      />
    </div>
    <div class="grid grid-cols-3 gap-20">
      <div v-for="(item, i) in uc.items" :key="i">
        <div class="text-2xl font-bold">
          {{ item.name }}
        </div>
        <div class="mt-4 text-lg">
          {{ item.desc }}
        </div>
      </div>
    </div>
    <div class="mt-10 flex items-center justify-center gap-x-6">
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
