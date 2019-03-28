<template>
  <div class="post-widget">
    <p class="title">Be at home anywhere.</p>
    <el-link path="/staying" btn="primary" size="large">Learn How</el-link>
  </div>
</template>

<script>
export default {}
</script>
<style lang="less">
.post-widget {
  position: absolute;
  top: 100vh;
  right: 20px;
  width: 220px;
  padding: 1em 1em 17em;
  border-radius: 0.5em;
  box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
    0 18px 36px -18px rgba(0, 0, 0, 0.3);
  background: #f2f9ff url(./img/home.png) no-repeat bottom center;
  background-size: contain;
  @media (max-width: 1024px) {
    position: relative;
    top: auto;
    right: auto;
    max-width: 220px;
    margin: 0 auto;
  }
  .title {
    font-weight: 600;
    font-size: 1.6em;
    text-align: center;
    padding: 1em 0;
  }
  .el-btn {
    width: 100%;
  }
}
</style>