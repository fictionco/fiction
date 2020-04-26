<template>
  <div class="example docs-component-example">
    <factor-link path="https://www.fiction.com">External Link</factor-link>
    <factor-link path="/">Local Link</factor-link>
    <factor-link btn="primary" path="/">Button</factor-link>
    <factor-link btn="default" path="/">Button</factor-link>
    <factor-link btn="primary" path="/" :loading="true">Button</factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { factorLink },
}
</script>
<style lang="less" scoped>
.example {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .factor-link {
    margin: 1rem;
  }
}
</style>
