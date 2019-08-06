<template>
  <div class="blog-content">
    <router-view />
  </div>
</template>

<script>
export default {}
</script>


<style lang="less">
.blog-content {
  .entries {
    max-width: 50rem;
    margin: -100px auto 0;
    padding: 1rem 0;
  }
}
</style>