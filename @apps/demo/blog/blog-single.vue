<template>
  <div class="demo-blog-single">
    <page-header
      title="Standard Blog"
      sub-title="Plugin Demo"
      url-overview="https://factor.dev/plugin/standard-blog"
    />
    <standard-blog-single />
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import { standardBlogSingle } from "@factor/plugin-blog"
export default {
  components: {
    pageHeader: () => import("../page-header.vue"),
    standardBlogSingle,
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
