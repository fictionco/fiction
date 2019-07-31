<template>
  <div class="blog">
    <div class="content-area">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {}
</script>

<style lang="less">
.blog {
  .content-area {
    max-width: 960px;
    margin: 0 auto;
  }
}
</style>