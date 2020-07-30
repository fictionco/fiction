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
  --item-shadow: 0 0 15px -5px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.25);
  .app-nav {
    box-shadow: var(--box-shadow-panel);
    .app-manager {
      border: none;
    }
  }
  .dashboard-panel {
    box-shadow: none;
    .cont {
      padding: 2rem 0;
    }
  }
  .app-layout .app-main {
    background: #fff;
  }
}
</style>
