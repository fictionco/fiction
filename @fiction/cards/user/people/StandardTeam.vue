<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config.js'
import { pathCheck, vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../../CardText.vue'
import CardActionArea from '../../el/CardActionArea.vue'
import { schema } from './config.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <ul
    role="list"
    class="grid gap-x-8 gap-y-12"
    :class="[
      uc.layout === 'mediabox'
        ? 'grid-cols-1'
        : 'sm:grid-cols-2 lg:grid-cols-3',
    ]"
  >
    <li
      v-for="(profile, i) in uc.items"
      :key="i"
      :class="[
        uc.layout === 'mediabox'
          ? 'flex flex-col md:flex-row md:items-start gap-8'
          : 'flex flex-col',
      ]"
    >
      <!-- Member photo with refined proportions -->
      <XMedia
        :media="profile.media"
        :animate="true"
        class="rounded-full overflow-hidden bg-theme-100 dark:bg-theme-800 flex-shrink-0 border-2 border-white"
        :class="[
          uc.layout === 'mediabox'
            ? 'w-32 md:w-48 aspect-[1/1]'
            : 'w-full aspect-[1/1]',
        ]"
      />

      <!-- Member details with balanced spacing -->
      <div class="mt-6 @container/txt grow" :class="uc.layout === 'mediabox' ? 'md:mt-0' : ''">
        <CardText
          animate="fade"
          :card
          :path="pathCheck(`items.${i}.title`, schema)"
          tag="h3"
          class="text-2xl @[300px]/txt:text-3xl @[700px]/txt:text-5xl font-semibold x-font-title"
        />
        <CardText
          animate="fade"
          :card
          :path="pathCheck(`items.${i}.subTitle`, schema)"
          tag="p"
          class="text-lg @[300px]/txt:text-2xl @[700px]/txt:text-2xl mt-1 text-theme-500 dark:text-theme-400 font-sans"
        />
        <CardText
          animate="fade"
          :card
          :path="pathCheck(`items.${i}.content`, schema)"
          tag="p"
          class="mt-3 text-lg @[500px]/txt:text-2xl  !leading-relaxed"
        />

        <!-- Social links with consistent spacing -->
        <CardActionArea
          v-if="profile.action"
          :card
          :base-path="pathCheck(`items.${i}.action`, schema)"
          :action="profile.action"
          :classes="{ buttons: 'flex gap-2 mt-4' }"
        />
      </div>
    </li>
  </ul>
</template>
