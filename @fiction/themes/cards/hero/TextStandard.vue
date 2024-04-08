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
  <div>
    <div
      :class="
        uc.layout === 'justified'
          ? `lg:flex justify-between text-left items-end gap-8`
          : uc.layout === 'left' ? 'text-left'
            : 'mx-auto text-center'
      "
    >
      <div :class="uc.layout === 'justified' ? 'min-w-[50%]' : ''">
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
          class="x-font-title text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter  text-balance"
          :class="uc.layout === 'justified' || uc.layout === 'left' ? 'mt-3' : 'my-7'"
          path="heading"
          placeholder="Heading"
        />
      </div>
      <div :class="uc.layout === 'justified' ? 'lg:max-w-[50%]' : ''">
        <CardText
          tag="h3"
          :card="card"
          class="mt-8 text-xl lg:text-3xl lg:leading-snug text-balance"
          :class="uc.layout === 'justified' ? 'text-right' : ''"
          path="subHeading"
          placeholder="Sub Heading"
        />
      </div>
    </div>
    <div
      v-if="uc.actions?.length"
      class="mt-10 flex items-center gap-x-6"
      :class="uc.layout === 'justified' ? 'justify-start' : 'justify-center'"
    >
      <CardElement
        v-for="(action, i) in uc.actions"
        :key="i"
        :card="card"
        theme-el="button"
        :btn="action.btn || 'default'"
        :href="action.href"
        :size="action.size || (uc.layout === 'justified' ? 'lg' : 'xl')"
      >
        {{ action.name }}
      </CardElement>
    </div>
  </div>
</template>
