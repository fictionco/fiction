<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { pathCheck, vue } from '@fiction/core'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  itemIndex: { type: Number, required: true },
  mode: { type: String as vue.PropType<'normal' | 'overlay'>, default: 'normal' },
})
const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center font-sans " :class="mode === 'overlay' ? '' : 'text-theme-500 dark:text-theme-200'">
      {{ itemIndex + 1 }} <span class="i-tabler-slash" /> {{ uc.items?.length }}
    </div>
    <transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-5"
      mode="out-in"
    >
      <div :key="itemIndex" class="space-y-6">
        <div class="space-y-3">
          <CardText :card :path="pathCheck(`items.${itemIndex}.title`, schema)" tag="h2" class="font-medium x-font-title text-xl md:text-3xl xl:text-4xl text-pretty" />
          <CardText
            :card
            :path="pathCheck(`items.${itemIndex}.content`, schema)"
            tag="p"
            class="text-lg md:text-xl xl:text-2xl text-pretty !leading-[1.4] line-clamp-4"
          />
        </div>
        <CardActionArea
          size="lg"
          :card
          :base-path="pathCheck(`items.${itemIndex}.action`, schema)"
          :classes="{ buttons: 'flex gap-4' }"
        />
      </div>
    </transition>
  </div>
</template>
