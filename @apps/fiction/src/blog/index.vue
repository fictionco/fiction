<template>
  <div class="blog-index">
    <div class="content-area">
      <blog-index />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "blog-index": () => import("@factor/plugin-blog/view-index")
  }
}
</script>

<style lang="less">
</style>