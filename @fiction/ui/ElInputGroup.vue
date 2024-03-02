<script lang="ts" setup>
import { localRef, toCamel } from '@fiction/core'
import InputToggle from './InputToggle.vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  wrapClass: {
    type: String,
    default: '',
  },
})

const show = localRef({
  key: toCamel(props.label),
  def: false,
  lifecycle: 'local',
})
</script>

<template>
  <div class="border-theme-200 rounded-md border px-4 py-2">
    <div class="flex items-center justify-between">
      <div class="text-theme-400 text-sm font-bold tracking-tight">
        {{ label }}
      </div>
      <InputToggle v-model="show" />
    </div>
    <div
      v-show="show"
      class="my-4"
      :class="wrapClass"
    >
      <slot />
    </div>
  </div>
</template>
