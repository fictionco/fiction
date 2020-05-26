<template>
  <div class="standard-blog-single">
    <blog-wrap>
      <blog-single />
    </blog-wrap>
  </div>
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
