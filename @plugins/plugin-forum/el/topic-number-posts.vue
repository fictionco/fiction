<template>
  <div class="number-comments">
    <factor-icon icon="far fa-comment" />22
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
.number-comments {
  .factor-icon {
    margin-right: 0.5rem;
  }
}
</style>
