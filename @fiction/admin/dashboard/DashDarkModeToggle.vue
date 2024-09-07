<script lang="ts" setup>
import InputToggle from '@fiction/ui/inputs/InputToggle.vue'
import type { vue } from '@fiction/core'
import type { Site } from '../../site'

defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
})
</script>

<template>
  <InputToggle v-model="site.isLightMode.value" />
</template>
