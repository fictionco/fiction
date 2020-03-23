<template>
  <div class="factor-extend" :class="$route.path.includes('plugin') ? 'plugin' : 'themes'">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>
<style lang="less">
.factor-extend {
  --panel-shadow: 0 0 0 1px rgba(0, 43, 93, 0.1), 0 0 1px rgba(58, 55, 148, 0.25),
    0 6px 14px 0 rgba(24, 32, 41, 0.06), 0 12px 34px 0 rgba(24, 32, 41, 0.04);
  --panel-shadow-inset: inset 0 0 0 1px rgba(0, 43, 93, 0.06),
    inset 0 0 1px rgba(58, 55, 148, 0.25), inset 0 -12px 34px 0 rgba(24, 32, 41, 0.03);
  --panel-movement: cubic-bezier(0.52, 0.01, 0.16, 1);
}
</style>
