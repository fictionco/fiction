<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { Card } from '@fiction/site'
import ActionButtons from '@fiction/ui/buttons/ActionButtons.vue'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'

import type { Statement, UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])

const activeItem = vue.ref(0)
</script>

<template>
  <div class="">
    <div class="flex overflow-x-auto no-scrollbar snap-mandatory snap-x">
      <div v-for="(item, i) in items" :key="i" class="slide shrink-0 w-full snap-center">
        <div class="max-w-[900px] mx-auto ">
          <div class="space-y-[2vw]">
            <CardText
              tag="div"
              class="text-4xl !leading-[1.4] sm:text-5xl sm:leading-[1.4] xl:text-6xl x-font-title font-medium  "
              :card="card"
              :path="`items.${i}.title`"
              animate="fade"
            />

            <CardText
              tag="div"
              class="text-2xl !leading-[1.8] sm:text-3xl x-font-title text-theme-500 dark:text-theme-300/90 ]"
              :card="card"
              :path="`items.${i}.content`"
              animate="fade"
            />
          </div>

          <ActionButtons class="mt-12  " :actions="item.actions || []" ui-size="xl" animate="rise" />
        </div>
      </div>
    </div>
    <NavDots v-model:active-item="activeItem" :container-id="card.cardId" :items class="mt-12 z-20" />
  </div>
</template>
