<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config.js'
import { pathCheck, vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import { schema } from './config.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <ul
    role="list"
    class="mx-auto grid gap-x-6 lg:gap-x-12 gap-y-16 lg:mx-0 "
    :class="uc.layout === 'mediabox' ? '' : 'sm:grid-cols-2'"
  >
    <li v-for="(profile, i) in uc.items" :key="i" class="space-y-4" :class="uc.layout === 'mediabox' ? 'flex flex-col gap-10 sm:flex-row' : ''">
      <XMedia
        class="rounded-2xl overflow-hidden dark:ring-1 dark:ring-theme-800 flex-shrink-0"
        :class="uc.layout === 'mediabox' ? 'aspect-[3/4] w-32 md:w-52' : 'aspect-[3/2] w-full '"
        :media="profile.media"
        :animate="true"
      />
      <div :class="uc.layout === 'mediabox' ? 'max-w-xl flex-auto' : ''">
        <CardText animate="fade" :card :path="pathCheck(`items.${i}.title`, schema)" tag="h3" class="lg:mt-6 text-lg lg:text-3xl x-font-title font-semibold leading-8" />
        <CardText animate="fade" :card :path="pathCheck(`items.${i}.subTitle`, schema)" tag="p" class="text-base lg:text-lg dark:text-theme-300 text-theme-500 x-font-title" />
        <CardText animate="fade" :card :path="pathCheck(`items.${i}.content`, schema)" tag="p" class="mt-4 text-base lg:text-lg" />
        <CardActionArea
          v-if="profile.action"
          :card
          :base-path="pathCheck(`items.${i}.action`, schema)"
          :classes="{ buttons: 'flex justify-center md:justify-start gap-3' }"
          class="mt-6"
          :action="profile.action"
        />
      </div>
    </li>
  </ul>
</template>
