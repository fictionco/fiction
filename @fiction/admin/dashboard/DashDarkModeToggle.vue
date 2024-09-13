<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Site } from '../../site'
import InputToggle from '@fiction/ui/inputs/InputToggle.vue'

defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
})
</script>

<template>
  <InputToggle v-model="site.isLightMode.value" />
</template>
