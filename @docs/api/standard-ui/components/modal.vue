<template>
  <div class="example docs-component-example">
    <factor-modal :vis.sync="vis">Your Modal Content</factor-modal>
    <factor-btn @click="vis = !vis">Show Modal &rarr;</factor-btn>
  </div>
</template>
<script lang="ts">
import { factorModal, factorBtn } from "@factor/ui"
export default {
  components: { factorModal, factorBtn },
  data() {
    return {
      vis: false,
    }
  },
}
</script>
<style lang="less" scoped>
.example {
  display: flex;
  align-items: center;
  .factor-link {
    margin: 1rem;
  }
}
</style>
