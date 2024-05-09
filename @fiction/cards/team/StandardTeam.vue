<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardSocials from '../el/CardSocials.vue'
import type { UserConfig } from './ElCard.vue'

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
  <ul
    role="list"
    class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20  lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
    :class="uc.layout === 'mediabox' ? '' : 'sm:grid-cols-2'"
  >
    <li v-for="(profile, i) in uc.profiles" :key="i" :class="uc.layout === 'mediabox' ? 'flex flex-col gap-10 sm:flex-row' : ''">
      <ElImage
        class="rounded-2xl overflow-hidden dark:ring-1 dark:ring-theme-800 flex-shrink-0"
        :class="uc.layout === 'mediabox' ? 'aspect-[3/4] w-32 md:w-52' : 'lg:aspect-[3/2] w-full '"
        :media="profile.media"
      />
      <div :class="uc.layout === 'mediabox' ? 'max-w-xl flex-auto' : ''">
        <h3 class="lg:mt-6 text-lg lg:text-3xl x-font-title font-semibold leading-8">
          {{ profile.name }}
        </h3>
        <p class="text-base leading-7 dark:text-theme-200 text-theme-500 x-font-title">
          {{ profile.title }}
        </p>
        <p class="mt-4 text-base leading-7">
          {{ profile.desc }}
        </p>
        <CardSocials v-if="profile.social" class="mt-6" :socials="profile.social" />
      </div>
    </li>
  </ul>
</template>
