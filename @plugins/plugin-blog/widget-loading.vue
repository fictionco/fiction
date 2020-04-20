<template>
  <div class="posts-loading">
    <factor-spinner />
  </div>
</template>
<script lang="ts">
import { factorSpinner } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorSpinner },
  methods: { setting },
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
