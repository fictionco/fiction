<template>
  <blog-wrap class="standard-blog-single" handling="single">
    <blog-single />
  </blog-wrap>
</template>

<script lang="ts">
import { setting } from "@factor/api"
export default {
  components: {
    blogWrap: setting("blog.components.blogWrap"),
    blogSingle: setting("blog.components.blogSingle"),
  },
}
</script>

<style lang="less"></style>
