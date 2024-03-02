<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
</script>

<template>
  <div class="min-h-screen">
    <SiteHeader />
    <slot />
  </div>
</template>
