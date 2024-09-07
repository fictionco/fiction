<script setup lang="ts">
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { EmailAction } from '../action'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<EmailAction>, required: true },
})
</script>

<template>
  <div class="text-center p-24 text-5xl font-bold">
    Test Transaction Landing Page
  </div>
</template>
