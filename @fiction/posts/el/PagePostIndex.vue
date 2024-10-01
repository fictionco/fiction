<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElPostIndex from './ElPostIndex.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const _x = true
</script>

<template>
  <div class="p-12 w-full max-w-screen-md mx-auto">
    <ElPostIndex :card />
  </div>
</template>
