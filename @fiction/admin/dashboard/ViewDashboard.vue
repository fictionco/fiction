<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import WidgetArea from './WidgetArea.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const _x = 1
</script>

<template>
  <div class="pt-4 md:pt-8 md:pb-36" :class="card.classes.value.contentWidth">
    <div class="grid grid-cols-12 gap-4 lg:gap-8">
      <div class="col-span-8">
        <WidgetArea location="homeMain" :card />
      </div>
      <div class="col-span-4">
        <WidgetArea location="homeSecondary" :card />
      </div>
    </div>
  </div>
</template>
