<template>
  <blog-wrap class="standard-blog-single" handling="single">
    <blog-single />
  </blog-wrap>
</template>

<script lang="ts">
export default {
  components: {
    blogWrap: () => import("./blog-wrap.vue"),
    blogSingle: () => import("./blog-single.vue"),
  },
}
</script>

<style lang="less"></style>
