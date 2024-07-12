<script setup lang="ts">
import type { NavItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import type { Card } from '@fiction/site/card'
import { socialIcons } from './util.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  socials: { type: Array as vue.PropType<NavItem[]>, required: true },
  justify: { type: String as vue.PropType<'left' | 'right' | 'center' | 'justify'>, default: '' },
})

function getIcon(value?: string) {
  if (!value)
    return ''

  const icon = socialIcons.find(i => i.value === value)
  return icon ? icon.icon : ''
}

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
  <div class="socials flex space-x-6 text-2xl">
    <a v-for="(item, i) in socials" :key="i" :href="item.href" target="_blank" class="x-action-items text-center flex items-center flex-col justify-end hover:text-primary-500 dark:hover:text-primary-400">
      <div :class="getIcon(item.icon)" class="" :title="item.name" />
    </a>
  </div>
</template>
