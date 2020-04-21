<template>
  <div class="spinner-example docs-component-example">
    <factor-spinner />
    <factor-spinner color-mode="primary" />
    <factor-spinner color-mode="text" />
  </div>
</template>
<script lang="ts">
import { factorSpinner } from "@factor/ui"
export default {
  components: { factorSpinner },
}
</script>
<style lang="less">
.spinner-example {
  display: flex;
  .factor-spinner {
    margin: 1rem;
  }
}
</style>
