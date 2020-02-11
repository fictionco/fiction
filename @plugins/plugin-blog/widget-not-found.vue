<template>
  <div class="posts-not-found">
    <div class="text">
      <div class="title">{{ setting("blog.notFound.title") }}</div>
      <div class="sub-title">{{ setting("blog.notFound.subTitle") }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  metaInfo() {
    return {
      title: setting("blog.notFound.title"),
      description: setting("blog.notFound.subTitle"),
      meta: [{ name: "robots", content: "noindex" }]
    }
  },
  created() {
    if (process) {
      process.env.factorServerStatus = "404"
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.posts-not-found {
  min-height: 50vh;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 1.6em;
    font-weight: var(--font-weight-bold, 700);
  }
  .sub-title {
    font-size: 1.3em;
    opacity: 0.7;
    margin-top: 1rem;
  }
}
</style>
