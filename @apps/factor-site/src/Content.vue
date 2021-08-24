<template>
  <div class="content-layout min-h-screen">
    <SiteHead />
    <router-view />
    <SiteFooter />
  </div>
</template>
<script lang="ts">
import { useMeta } from "@factor/api"
import { computed } from "vue"
import SiteHead from "./el/SiteHead.vue"
import SiteFooter from "./el/SiteFooter.vue"

export default {
  name: "ContentWrap",
  components: {
    SiteHead,
    SiteFooter,
  },
  setup() {
    useMeta({
      title: computed(() => {
        return `Factor Framework by Darwin`
      }),
      meta: [
        {
          name: `description`,
          content: "Next generation full-stack JavaScript Framework",
        },
      ],
    })
  },
}
</script>

<style lang="less">
@import "./styles.less";
</style>
