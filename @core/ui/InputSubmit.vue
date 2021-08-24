<template>
  <ElemButton type="submit" btn="primary" v-bind="$attrs">
    <slot />
  </ElemButton>
</template>
<script lang="ts">
import ElemButton from "./ElemButton.vue"
export default {
  components: { ElemButton },
}
</script>
