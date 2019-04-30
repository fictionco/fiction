<template>
  <div class="blog-wrap">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
:root {
  --panel-shadow: 0 0 1px rgba(58, 55, 148, 0.25),
    0 6px 14px 0 rgba(24, 32, 41, 0.06), 0 12px 34px 0 rgba(24, 32, 41, 0.04);
}
.blog-wrap {
  .grid-entry,
  .grid-aside,
  .related-entry {
    box-shadow: var(--panel-shadow);
    background: #fff;
    border-radius: 5px;
  }
}
</style>
