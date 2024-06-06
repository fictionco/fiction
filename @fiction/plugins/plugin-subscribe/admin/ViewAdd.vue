<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const _x = true
</script>

<template>
  <div class="py-12" :class="card.classes.value.contentWidth">
    add
  </div>
</template>
