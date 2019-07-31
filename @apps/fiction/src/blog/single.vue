<template>
  <div class="blog-single">
    <div class="content-area">
      <blog-single />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "blog-single": () => import("@factor/plugin-blog/blog-single")
  }
}
</script>

<style lang="less">
</style>