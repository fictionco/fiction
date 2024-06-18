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
const x = 1
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="grid grid-cols-5 gap-4 lg:gap-8">
      <div class="col-span-3">
        <WidgetArea location="homeMain" :card />
      </div>
      <div class="col-span-2">
        <WidgetArea location="homeSecondary" :card />
      </div>
    </div>
  </div>
</template>
