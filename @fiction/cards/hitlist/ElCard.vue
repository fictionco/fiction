<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import CardText from '@fiction/cards/CardText.vue'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim/index.js'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

vue.onMounted(() => {
  useElementVisible({
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'rise', config: { overallDelay: 600, totalAnimationTime: 2000 } })
    },
  })
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="mx-auto max-w-screen-lg">
      <EffectFitText :content="uc.title || ''" class="max-w-screen-md mx-auto text-center mb-16 x-font-title" :lines="1">
        <CardText :card tag="span" path="title" animate="rise" />
      </EffectFitText>
      <div class="grid grid-cols-[1fr_1fr] gap-16">
        <div
          v-for="(item, i) in uc.items"
          :key="i"
          class="flex items-start gap-6 x-action-item"
          :class="[
            i % 2 === 0 ? 'col-start-1' : 'col-start-2',
            i % 2 === 0 ? 'row-span-2' : 'row-start-[calc(var(--row)*2)]',
          ]"
          :style="{ '--row': Math.floor(i / 2) + 1 }"
        >
          <div class="flex-shrink-0 size-16 bg-primary-200/20 dark:bg-primary-700/30 text-primary-400 dark:text-primary-500 rounded-full flex items-center justify-center">
            <span class="text-4xl font-semibold font-sans">{{ i + 1 }}</span>
          </div>
          <div>
            <p class="text-2xl x-font-title leading-relaxed">
              {{ item.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
