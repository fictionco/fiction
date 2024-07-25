<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElIndex from './ElIndex.vue'

type UserConfig = {
  isNavItem: boolean
}
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
</script>

<template>
  <div>
    <ElIndex :card="card" />
  </div>
</template>
