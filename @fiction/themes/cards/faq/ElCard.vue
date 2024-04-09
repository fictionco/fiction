<script lang="ts" setup>
import type { NavItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'

export type UserConfig = {
  items?: NavItem[]
  heading?: string
}

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="text-4xl lg:text-7xl x-font-title font-semibold">
      {{ uc.heading }}
    </div>
    <div>
      <div
        v-for="(item, i) in uc.items"
        :key="i"
      >
        <div class="divider h-[1px] dark:bg-theme-800 bg-theme-200 my-6" />
        <div

          class="py-4 flex justify-between gap-6 items-center "
        >
          <div class="space-y-2">
            <div class="text-2xl lg:text-4xl x-font-title font-semibold">
              {{ item.name }}
            </div>
            <div class="text-lg lg:text-xl">
              {{ item.desc }}
            </div>
          </div>
          <div class="text-5xl lg:text-8xl font-sans font-light">
            {{ String(i + 1).padStart(2, '0') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
