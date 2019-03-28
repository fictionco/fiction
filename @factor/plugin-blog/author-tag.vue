<template>
  <div class="blog-author-card">
    <el-avatar :uid="author.uid" />
    <span class="name">{{ author.displayName }}</span>
  </div>
</template>
<script>
export default {
  props: {
    author: { type: Object, default: () => {} }
  }
}
</script>
<style lang="less">
.blog-author-card {
  display: flex;
  align-items: center;
  margin-right: 1em;
  padding: 0.3em 0;
  .avatar {
    display: block;
    margin-right: 10px;
    float: left;
  }
  .name {
    font-weight: 600;
  }
}
</style>
