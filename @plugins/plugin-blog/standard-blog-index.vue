<template>
  <div class="standard-blog-index">
    <blog-wrap>
      <blog-index />
    </blog-wrap>
  </div>
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
