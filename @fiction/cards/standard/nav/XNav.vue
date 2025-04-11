<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import { useService, vue } from '@fiction/core'

const props = defineProps({
  nav: { type: Array as vue.PropType<NavListItem[]>, required: true },
  itemClass: { type: String, default: '' },
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  activeItem: { type: Object, required: false },
})

const emit = defineEmits<{
  (event: 'update:activeItem', payload: NavListItem | undefined): void
}>()

const { fictionRouter } = useService()

const processedNav = vue.computed(() =>
  (props.nav || []).map(item => ({
    ...item,
    isActive: item.href === fictionRouter.current.value.path,
  })),
)
</script>

<template>
  <div>
    <div
      v-for="(item, i) in processedNav"
      :key="i"
      class="group relative"
    >
      <CardNavLink
        :card
        :item
        :class="[
          itemClass,
        ]"
        :depth="0"
        hover-effect="underline"
        @click="closeMenu()"
      />
    </div>
  </div>
</template>
