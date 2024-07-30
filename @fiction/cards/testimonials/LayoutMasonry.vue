<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/media/ElImage.vue'
import MasonryEffect from '@fiction/ui/effect/EffectMasonry.vue'
import CardText from '../CardText.vue'

import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])

const masonryOptions = {
  percentPosition: true,
  defaultCols: 6,
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <MasonryEffect :items="items" :options="masonryOptions" gap="2vw">
      <template #default="{ item, index }">
        <div class="relative rounded-2xl overflow-hidden shadow-lg bg-theme-600 dark:bg-theme-700 transition-all duration-300 hover:shadow-xl">
          <ElImage class="absolute inset-0 object-cover" :media="item?.media || item?.user?.avatar" />
          <div class="flex flex-col justify-between">
            <div class="grow h-72" />
            <div class="md:flex justify-between relative p-6 ">
              <div class="space-y-4 relative z-10">
                <div class="text-theme-50 opacity-20">
                  <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
                  </svg>
                </div>
                <CardText
                  tag="div"
                  class="text-lg sm:text-2xl text-theme-50 !leading-[1.4]"
                  :card="card"
                  :path="`items.${index}.content`"
                  animate="fade"
                />
              </div>
              <div class="flex flex-wrap gap-2 md:flex-col items-center justify-center  p-6 relative z-10">
                <ElImage :media="item.user?.avatar" class="size-16 rounded-full ring-2 ring-white overflow-hidden" />
                <div class="md:text-center">
                  <CardText
                    tag="div"
                    class="text-base font-medium text-theme-50 leading-tight"
                    :card="card"
                    :path="`items.${index}.user.fullName`"
                    animate="fade"
                  />
                  <CardText
                    tag="div"
                    class="text-xs opacity-50 font-sans mt-1"
                    :card="card"
                    :path="`items.${index}.user.title`"
                    animate="fade"
                  />
                </div>
              </div>
              <div class="overlay absolute w-full h-full z-0 pointer-events-none inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,.5)_0,rgba(0,0,0,.3)_40%,transparent_70%)]" />
            </div>
          </div>
        </div>
      </template>
    </MasonryEffect>
  </div>
</template>
