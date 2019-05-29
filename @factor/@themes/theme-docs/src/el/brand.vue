<template>
  <div class="brand">
    <factor-link path="/">
      <primary-logo />
    </factor-link>
  </div>
</template>
<script>
export default {
  components: {
    "primary-logo": () => import("./logo-factor")
  }
}
</script>
<style lang="less">
.brand {
  display: flex;

  align-items: center;
  width: 100px;
  a img {
    width: 80px;
  }
}
</style>