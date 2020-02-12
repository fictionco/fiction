<template>
  <div class="grid-controls">
    <slot />
  </div>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>
<style lang="less">
.grid-controls {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;

  align-items: center;
  margin-bottom: 1.5em;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
</style>
