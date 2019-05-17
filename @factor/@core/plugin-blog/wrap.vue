<template>
  <div class="blog-wrap">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.blog-wrap {
  .grid-entry,
  .grid-aside,
  .related-entry {
    box-shadow: var(--input-shadow);
    background: #fff;
    border-radius: 5px;
  }
}
</style>
