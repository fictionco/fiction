<script lang="ts" setup>
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

const attrs = vue.useAttrs()
</script>

<template>
  <XButton
    type="submit"
    theme="primary"
    v-bind="attrs"
  >
    <slot />
  </XButton>
</template>
