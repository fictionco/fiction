<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config.js'
import { vue } from '@fiction/core'
import CardText from '../../CardText.vue'
import StandardTeam from './StandardTeam.vue'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="grid grid-cols-1 gap-x-8 lg:gap-x-16 gap-y-12 lg:grid-cols-12">
      <!-- Header section with improved spacing and alignment -->
      <div
        v-if="uc.title"
        class="lg:col-span-4 flex flex-col text-center lg:text-left space-y-4"
      >
        <CardText
          animate="fade"
          :card
          path="title"
          tag="h2"
          class="text-3xl font-semibold tracking-tight md:text-4xl x-font-title"
        />
        <CardText
          animate="fade"
          :card
          path="subTitle"
          tag="p"
          class="text-base md:text-lg xl:text-xl leading-relaxed text-theme-600 dark:text-theme-300"
        />
      </div>

      <!-- Team members with adaptive column span -->
      <StandardTeam
        :card
        :class="uc.title ? 'lg:col-span-8' : 'lg:col-span-12'"
      />
    </div>
  </div>
</template>
