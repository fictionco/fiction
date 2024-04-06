<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardElement from '../CardElement.vue'
import CardText from '../CardText.vue'
import type { UserConfig } from './ElHero.vue'

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
  <div class="mx-auto text-center">
    <div>
      <CardText
        tag="h3"
        :card="card"
        class="text-theme-500 dark:text-theme-500 font-sans text-sm lg:text-base font-medium"
        path="superHeading"
        placeholder="Super Heading"
      />
      <CardText
        tag="h1"
        :card="card"
        class="x-font-title text-4xl mt-7 mb-8 font-bold tracking-tighter lg:text-7xl text-balance"
        path="heading"
        placeholder="Heading"
      />
    </div>
    <div>
      <CardText
        tag="h3"
        :card="card"
        class="mt-8 text-xl lg:text-3xl lg:leading-snug text-balance "
        path="subHeading"
        placeholder="Sub Heading"
      />

      <div v-if="uc.actions?.length" class="mt-10 flex items-center justify-center gap-x-6">
        <CardElement
          v-for="(action, i) in uc.actions"
          :key="i"
          :card="card"
          theme-el="button"
          :btn="action.btn || 'default'"
          :href="action.href"
          :size="action.size || 'xl'"
        >
          {{ action.name }}
        </CardElement>
      </div>
    </div>
  </div>
</template>
