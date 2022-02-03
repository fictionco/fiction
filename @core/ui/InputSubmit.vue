<template>
  <ElButton type="submit" btn="primary" v-bind="attrs">
    <slot />
  </ElButton>
</template>
<script lang="ts" setup>
import { useAttrs } from "vue"
import ElButton from "./ElButton.vue"
const attrs = useAttrs()
</script>
