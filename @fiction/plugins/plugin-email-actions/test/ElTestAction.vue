<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { vue } from '@fiction/core'
import type { EmailAction } from '../action'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<EmailAction>, required: true },
})
</script>

<template>
  <div>hello</div>
</template>
