<script lang="ts" setup>
import { colorList } from '@fiction/core'

import InputSelect from './InputSelectCustom.vue'

const list = [{ format: 'title', name: 'Color Schemes' }, ...Object.keys(colorList)]
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <InputSelect v-bind="{ ...$attrs, list }" />
</template>
