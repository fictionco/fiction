<template>
  <div class="demo">
    <demo-header />
    <router-view />
  </div>
</template>
<script lang="ts">
export default {
  components: { demoHeader: () => import("./header.vue") },
}
</script>

