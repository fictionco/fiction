<template>
  <div class="blog-wrap">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>


<style lang="less">
.blog-wrap {
  .entries {
    max-width: 50rem;
    margin: -100px auto 0;
    padding: 1rem 0;
    @media (max-width: 767px) {
      margin: 0 auto;
    }
  }
}
</style>