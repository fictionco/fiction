<template>
  <div class="example docs-component-example">
    <factor-icon icon="fas fa-key" />
    <factor-icon icon="far fa-trash-alt" />
    <factor-icon icon="fas fa-map-marker-alt" />
    <factor-icon icon="fas fa-camera x2" />
    <factor-icon icon="fas fa-times x2" />
    <factor-icon icon="fas fa-plus-square x2" />
  </div>
</template>
<script lang="ts">
import { factorIcon } from "@factor/ui"
export default {
  components: { factorIcon },
}
</script>
<style lang="less" scoped>
.example {
  display: flex;
  align-items: center;
  .factor-icon {
    margin: 1rem;
    &.x2 {
      font-size: 2em;
    }
  }
}
</style>
