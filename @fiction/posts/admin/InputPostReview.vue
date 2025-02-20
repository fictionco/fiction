<script lang="ts" setup>
import type { ComplexDataFilter, StandardSize } from '@fiction/core'
import type { Post } from '../post'

defineOptions({ name: 'InputAudienceFilter' })

const { modelValue = [], uiSize, post } = defineProps<{
  modelValue?: ComplexDataFilter[]
  uiSize?: StandardSize
  post: Post
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ComplexDataFilter[]): void
}>()
</script>

<template>
  <div class="space-y-6">
    review stuff
  </div>
</template>
