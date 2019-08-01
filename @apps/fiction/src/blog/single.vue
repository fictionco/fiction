<template>
  <div class="blog-view-single">
    <view-single>
      <template #after-entry>
        <widget-share-post :post-id="post._id" />
        <widget-author-bio v-for="_id in post.author" :key="_id" :post-id="_id" />
      </template>
      <template #after-title>
        <widget-featured-image :post-id="post.avatar" class="single-image" />
      </template>
    </view-single>
  </div>
</template>
<script>
export default {
  components: {
    "view-single": () => import("@factor/plugin-blog/view-single"),
    "widget-author-bio": () => import("@factor/plugin-blog/widget-author-bio"),
    "widget-share-post": () => import("@factor/plugin-blog/widget-share-post"),
    "widget-featured-image": () =>
      import("@factor/plugin-blog/widget-featured-image")
  },
  computed: {
    post() {
      return this.$store.val("post") || {}
    }
  }
}
</script>
<style lang="less">
.single-image {
  box-shadow: var(--panel-shadow);
  border-radius: 5px;
}
</style>