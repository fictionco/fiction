<template>
  <div class="site-brand">
    <factor-link path="/">
      <component :is="$setting.get(`site.logo`)" />
    </factor-link>
  </div>
</template>