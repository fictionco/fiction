<template>
  <div class="topic-post-author">
    <factor-icon icon="fas fa-reply" />
    <span class="username">arpowers</span>
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
.topic-post-author {
  .factor-icon {
    margin-right: 0.5rem;
  }
}
</style>
