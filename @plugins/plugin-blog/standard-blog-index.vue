<template>
  <blog-wrap class="standard-blog-index" handling="index">
    <blog-index />
  </blog-wrap>
</template>

<script lang="ts">
export default {
  components: {
    blogWrap: () => import("./blog-wrap.vue"),
    blogIndex: () => import("./blog-index.vue"),
  },
}
</script>

<style lang="less"></style>
