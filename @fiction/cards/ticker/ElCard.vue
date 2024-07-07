<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'

import type { Quote, UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 lg:px-8">
    <div class="flex overflow-x-auto no-scrollbar snap-mandatory snap-x">
      ...
    </div>
  </div>
</template>
