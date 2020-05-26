<template>
  <div class="view-blog">
    <page-header
      title="Standard Blog"
      sub-title="Plugin Demo"
      url-overview="https://factor.dev/plugin/standard-blog"
    />
    <standard-blog-index />
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import { standardBlogIndex } from "@factor/plugin-blog"
export default {
  components: {
    pageHeader: () => import("../page-header.vue"),
    standardBlogIndex,
  },
  data() {
    return {
      loading: true,
      bw: setting("blog.blogWrap"),
    }
  },
  metaInfo() {
    return {
      title: "Blog Demo",
      description: "Blog plugin demo",
    }
  },
  methods: { setting },
}
</script>
<style lang="less">
</style>
