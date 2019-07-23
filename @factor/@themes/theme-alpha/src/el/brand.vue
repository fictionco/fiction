<template>
  <div class="brand">
    <app-link path="/">
      <component :is="$setting.get(`site.logo`)" />
    </app-link>
  </div>
</template>