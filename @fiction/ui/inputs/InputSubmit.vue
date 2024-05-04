<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElButton from '../ElButton.vue'

const attrs = vue.useAttrs()
</script>

<template>
  <ElButton
    type="submit"
    btn="primary"
    v-bind="attrs"
  >
    <slot />
  </ElButton>
</template>
