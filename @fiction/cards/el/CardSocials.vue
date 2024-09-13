<script setup lang="ts">
import type { NavItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  socials: { type: Array as vue.PropType<NavItem[]>, required: true },
  justify: { type: String as vue.PropType<'left' | 'right' | 'center' | 'justify'>, default: '' },
})

const clr = { textClasses: 'text-primary-500 dark:text-primary-200', bgClasses: 'bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50' }

vue.onMounted(() => {
  useElementVisible({
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'fade', config: { overallDelay: 600 } })
    },
  })
})
</script>

<template>
  <div class="socials flex gap-3">
    <a
      v-for="(item, i) in socials"
      :key="i"
      :href="item.href"
      target="_blank"
      :class="[clr.bgClasses, clr.textClasses]"
      class="x-action-items text-center flex items-center justify-center size-10 text-2xl rounded-full"
    >
      <XIcon v-if="item.media" :media="item.media" :title="item.name" />
    </a>
  </div>
</template>
