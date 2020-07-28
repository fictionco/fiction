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
            "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
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
