<script lang="ts" setup>
import type { vue } from '@fiction/core'
import InputToggle from '@fiction/ui/inputs/InputToggle.vue'
import type { Site } from '../../../site'

defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
})
</script>

<template>
  <InputToggle v-model="site.isLightMode.value" />
</template>
