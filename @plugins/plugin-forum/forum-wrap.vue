<template>
  <div class="forum-wrap">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  components: {},
})
</script>

<style lang="less">
.forum-wrap {
  max-width: var(--forum-width, 1100px);
  margin: 5rem auto 1em;
  padding: 2rem;
  @media (max-width: 900px) {
    margin-top: 3rem;
    padding: 0rem;
  }
}
</style>
