<template>
  <div class="blog-wrap">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {}
</script>


<style lang="less">
.blog-wrap {
  .entries {
    max-width: 50rem;
    margin: 0 auto 0;
    padding: 1rem 0;
    @media (max-width: 767px) {
      margin: 0 auto;
    }
  }
}
</style>