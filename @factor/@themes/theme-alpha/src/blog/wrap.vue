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
    padding: 6em 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
}
</style>