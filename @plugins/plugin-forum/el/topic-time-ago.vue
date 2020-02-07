<template>
  <div class="time-ago">
    <factor-icon icon="far fa-clock" />
    <span class="time">4 hours ago</span>
  </div>
</template>
<script lang="ts">
import { factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: { factorIcon }
})
</script>
<style lang="less">
.time-ago {
  .factor-icon {
    margin-right: 0.5rem;
  }
  .time {
    font-weight: var(--font-weight-bold, 700);
  }
}
</style>
