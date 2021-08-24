<template>
  <div class="content-layout" :class="wrapClass">
    <SiteHead />
    <router-view class="pt-20" />
    <SiteFooter />
  </div>
</template>
<script lang="ts">
// eslint-disable-next-line import/no-unresolved
import sharingIcon from "/icon-500.jpg"
// eslint-disable-next-line import/no-unresolved
import socialImage from "/social.jpg"
import { useMeta, stored, storeItem, toLabel } from "@factor/api"
import { computed, watch } from "vue"
import SiteHead from "./_global/SiteHead.vue"
import SiteFooter from "./_global/SiteFooter.vue"
import { useRouter } from "vue-router"
export default {
  name: "ContentWrap",
  components: {
    SiteHead,
    SiteFooter,
  },
  setup() {
    const router = useRouter()
    const wrapClass = computed(() =>
      stored("pageMode") == "dark" ? "bg-primary-900 text-white" : "",
    )

    watch(
      () => router.currentRoute.value.path,
      (v, old) => {
        if (v != old) storeItem("pageMode", "standard")
      },
    )

    const metaTitle = computed(() => {
      const r = router.currentRoute.value
      const pathName = (r.name || r.path) as string
      return `${toLabel(pathName)} - Darwin`
    })

    const metaDescription =
      "Create digital experiences that grow your traffic and increase sales."

    useMeta({
      title: metaTitle,
      meta: [
        {
          name: "description",
          content: metaDescription,
        },

        {
          vmid: "og:image",
          property: "og:image",
          content: socialImage,
        },
        {
          vmid: "icon",
          rel: "icon",
          href: sharingIcon,
        },
        // {
        //   property: "og:title",
        //   content: metaTitle,
        // },
        // {
        //   property: "og:description",
        //   content: metaDescription,
        // },
        // {
        //   name: "twitter:card",
        //   content: "summary",
        // },
        // {
        //   name: "twitter:title",
        //   content: metaTitle,
        // },
        // {
        //   name: "twitter:description",
        //   content: metaDescription,
        // },
        // {
        //   name: "twitter:image",
        //   content: socialImage,
        // },
      ],
      htmlAttrs: { lang: "en" },
    })
    return { wrapClass }
  },
}
</script>

<style lang="less">
@import "./styles.less";
</style>
