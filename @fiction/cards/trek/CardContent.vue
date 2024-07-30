<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import CardText from '../CardText.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  itemIndex: { type: Number, required: true },
  mode: { type: String as vue.PropType<'normal' | 'overlay'>, default: 'normal' },
})
const uc = vue.computed(() => props.card.userConfig.value || {})
const activeItem = vue.computed(() => uc.value.items?.[props.itemIndex] || {})

const actions = vue.computed(() => {
  return activeItem.value.actions
})
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
      <div :key="itemIndex">
        <div class="space-y-3">
          <CardText :card :path="`items.${itemIndex}.header`" tag="h2" class="font-semibold x-font-title text-xl md:text-3xl xl:text-5xl text-pretty" />
          <CardText :card :path="`items.${itemIndex}.subHeader`" tag="p" class="text-lg md:text-xl xl:text-4xl text-pretty !leading-[1.4]" />
        </div>
        <ElActions v-if="actions" class="mt-6" :actions :is-overlay="mode === 'overlay'" />
      </div>
    </transition>
  </div>
</template>
