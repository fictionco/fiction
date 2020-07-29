<template>
  <div class="content-layout">
    <router-view />
  </div>
</template>
<script lang="ts">
import { toLabel } from "@factor/api"
export default {
  name: "ContentWrap",
  components: {},
  metaInfo(this: any) {
    const pathName = this.$route.name || this.$route.path
    return {
      titleTemplate: "%s - Darwin Analytics",
      title: toLabel(pathName) || "No Name",
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
  .dashboard-panel,
  .app-nav {
    box-shadow: var(--box-shadow-panel);
    .app-manager {
      border: none;
    }
    .app-main {
      background: #fff;
    }
  }
}
</style>
