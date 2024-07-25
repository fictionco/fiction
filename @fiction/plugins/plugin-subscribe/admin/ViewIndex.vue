<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElSubscriberList from './ElSubscriberList.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const _x = 1
</script>

<template>
  <div class="flex flex-col gap-8">
    <ElSubscriberList :card />
  </div>
</template>
