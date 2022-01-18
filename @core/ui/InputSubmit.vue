<template>
  <ElemButton type="submit" btn="primary" v-bind="attrs">
    <slot />
  </ElemButton>
</template>
<script lang="ts" setup>
import { useAttrs } from "vue"
import ElemButton from "./ElemButton.vue"
const attrs = useAttrs()
</script>
