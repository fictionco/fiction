<template>
  <div class="docs-engine-wrap">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  components: {}
})
</script>

<style lang="less">
.docs-engine-wrap {
  --content-width: 1100px;
  --panel-shadow: 0 0 0 2px rgba(0, 43, 93, 0.1), 0 0 1px rgba(58, 55, 148, 0.25),
    0 3px 3px 0 rgba(24, 32, 41, 0.06), 0 6px 14px -10px rgba(24, 32, 41, 0.04);
  --panel-shadow-inset: inset 0 0 0 1px rgba(0, 43, 93, 0.06),
    inset 0 0 1px rgba(58, 55, 148, 0.25), inset 0 -12px 34px 0 rgba(24, 32, 41, 0.03);
}
</style>
