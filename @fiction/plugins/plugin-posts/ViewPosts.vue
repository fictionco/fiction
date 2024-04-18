<script lang="ts" setup>
import type { vue } from '@fiction/core'

import type { Card, Site } from '@fiction/site'

type UserConfig = {
  isNavItem: boolean
}
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
</script>

<template>
  <div>hello world</div>
</template>
