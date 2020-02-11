<template>
  <div class="posts-loading">
    <factor-loading-ring />
  </div>
</template>
<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorLoadingRing },
  methods: { setting }
})
</script>
<style lang="less" scoped>
.posts-loading {
  min-height: 50vh;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}
</style>
