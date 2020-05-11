<template>
  <div class="page-blog">
    <el-hero :title="blogTitle">
      <template v-slot:hero-content>
        <div v-if="blogSubtitle" v-formatted-text="blogSubtitle" class="content" />
      </template>
    </el-hero>
    <el-newsletter />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {
    "el-hero": () => import("./el/hero.vue"),
    "el-newsletter": () => import("./el/newsletter.vue"),
  },
  data() {
    return {
      loading: true,
      blogTitle: setting("blog.title"),
      blogSubtitle: setting("blog.subtitle"),
    }
  },
  metaInfo() {
    return {
      title: setting("blog.metatags.title"),
      description: setting("blog.metatags.description"),
      image: setting("blog.metatags.image"),
    }
  },
}
</script>

<style lang="less">
.page-blog {
  .mast {
    margin: 0 auto;
    max-width: 1140px;
  }
  .blog-inner {
    padding: 3rem 2rem;
  }
}
</style>
