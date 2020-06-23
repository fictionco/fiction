<template>
  <blog-wrap class="standard-blog-index" handling="index">
    <blog-index />
  </blog-wrap>
</template>

<script lang="ts">
import { setting } from "@factor/api"
export default {
  components: {
    blogWrap: setting("blog.components.blogWrap"),
    blogIndex: setting("blog.components.blogIndex"),
  },
}
</script>

<style lang="less"></style>
