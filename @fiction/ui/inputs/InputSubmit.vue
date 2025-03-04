<script lang="ts" setup>
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

defineOptions({ name: 'InputSubmit' })

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
