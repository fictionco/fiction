<script lang="ts" setup>
import El404 from '@fiction/ui/page/El404.vue'

import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'

// export type UserConfig = InstanceType<typeof El404>['$props']

defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})
</script>

<template>
  <El404 v-bind="card.userConfig" />
</template>
