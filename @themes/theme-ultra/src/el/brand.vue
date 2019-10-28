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
  width: 130px;
  margin: 2rem;
  a img {
    width: 80px;
  }
}
</style>