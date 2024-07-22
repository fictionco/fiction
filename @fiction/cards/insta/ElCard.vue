<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { CardRequests, UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig, { requests: CardRequests }>>, required: true },
})

const vis = vue.ref(false)

vue.onMounted(async () => {
  const x = props.card.request('instagram', { test: true })
})
</script>

<template>
  <div>test</div>
</template>
