<template>
  <div class="demo">
    <route-switcher />
    <router-view />
  </div>
</template>
<script lang="ts">
export default {
  components: { routeSwitcher: () => import("./switcher.vue") },
}
</script>

