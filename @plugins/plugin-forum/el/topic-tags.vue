<template>
  <div class="tags">
    <div class="tag">something</div>
    <div class="tag">abc</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>
<style lang="less">
.tags {
  font-size: 0.85em;
  .tag {
    border-radius: 5px;
    padding: 0 0.5rem;
    display: inline-block;
    margin: 0 0 0.5rem 0.5rem;
    background: var(--color-bg-contrast);
  }
}
</style>
