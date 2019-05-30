<template>
  <div class="brand">
    <factor-link path="/">
      <component :is="$setting.get(`site.logo`)" />
    </factor-link>
  </div>
</template>
<script>
export default {}
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