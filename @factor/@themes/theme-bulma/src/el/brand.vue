<template>
  <div class="site-brand">
    <component :is="$setting.get(`site.logo`)" />
  </div>
</template>
<style lang="scss">
.site-brand {
  display: inline-block;
  line-height: 1;
}
</style>
