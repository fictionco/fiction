<script lang="ts" setup>
import type { ActionItem } from '@fiction/core'
import { vue } from '@fiction/core'
import XElement from '../../engine/XElement.vue'
import type { Card } from '../../card'
import XText from '../../el/XText.vue'

export type UserConfig = {
  heading?: string
  subHeading?: string
  superHeading?: string
  actions?: ActionItem[]
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
  <div class=" ">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="mx-auto text-center">
        <XText
          tag="h3"
          :card="card"
          class="text-theme-500 dark:text-theme-500  font-sans text-sm lg:text-base font-medium"
          path="superHeading"
          placeholder="Super Heading"
        />
        <XText
          tag="h1"
          :card="card"
          class="x-font-title text-4xl my-8 font-bold tracking-tighter lg:text-7xl text-balance"
          path="heading"
          placeholder="Heading"
        />
        <XText
          tag="h3"
          :card="card"
          class="mt-8 text-xl lg:text-3xl lg:leading-snug text-balance "
          path="subHeading"
          placeholder="Sub Heading"
        />

        <div class="mt-10 flex items-center justify-center gap-x-6">
          <XElement
            v-for="(action, i) in uc.actions"
            :key="i"
            :card="card"
            theme-el="button"
            :btn="action.btn || 'default'"
            :href="action.href"
            :size="action.size || 'xl'"
          >
            {{ action.name }}
          </XElement>
        </div>
      </div>
    </div>
  </div>
</template>
