<template>
  <div class="content-layout">
    <site-head />
    <router-view />
    <site-footer />
  </div>
</template>
<script lang="ts">
export default {
  name: "ContentWrap",
  components: {
    "site-head": () => import("./site-head.vue"),
    "site-footer": () => import("./site-footer.vue"),
  },
  metaInfo() {
    return {
      titleTemplate: "%s - Darwin Analytics",
      link: [
        {
          vmid: "font",
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&display=fallback",
        },
      ],
    }
  },
}
</script>

<style lang="less">
.content-layout {
}
</style>
