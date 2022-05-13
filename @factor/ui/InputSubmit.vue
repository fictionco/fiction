<template>
  <ElButton type="submit" btn="primary" v-bind="attrs">
    <slot />
  </ElButton>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import ElButton from "./ElButton.vue"
const attrs = vue.useAttrs()
</script>
