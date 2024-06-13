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
  <div class="py-12" :class="card.classes.value.contentWidth">
    <div><WidgetArea location="homeMain" :card /></div>
  </div>
</template>
