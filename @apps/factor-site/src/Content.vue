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
        return `FactorJS by Darwin - JavaScript Website Framework`
      }),
      meta: [
        {
          name: `description`,
          content:
            "A next-generation framework for building websites, blogs, and apps with JavaScript",
        },
      ],
    })
  },
}
</script>

<style lang="less">
@import "./styles.less";
</style>
