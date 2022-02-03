<template>
  <div class="w-full flex">
    <div
      class="doc-selector min-w-0 flex-auto px-4 py-12 pb-24 sm:px-6 xl:px-8 lg:pb-16 min-h-screen"
    >
      <HighlightCode v-if="config.component" class="shadow-none">
        <div class="entry max-w-prose m-auto lg:px-6">
          <h1 class="border-b border-slate-200 mb-12 pb-6">
            {{ config?.title }}
          </h1>
          <div class="toc-content entry">
            <component :is="config.component" />
          </div>
        </div>
      </HighlightCode>
    </div>
    <div class="hidden xl:text-sm xl:block flex-none w-64 pl-8 mr-8 pt-14">
      <EntryToc selector=".toc-content" />
    </div>
  </div>
</template>

<script lang="ts">
import HighlightCode from "@factor/plugin-highlight-code/HighlightCode.vue"
import { useMeta, camelize, toLabel } from "@factor/api"
import { useRouter } from "vue-router"
import ElSpinner from "@factor/ui/ElSpinner.vue"
import {
  shallowRef,
  ref,
  computed,
  onServerPrefetch,
  watch,
  markRaw,
} from "vue"

import { getDocConfig, DocPageConfig } from "@factor/plugin-docs-engine"

import EntryToc from "@factor/ui/EntryToc.vue"
export default {
  components: {
    ElSpinner,

    EntryToc,
    HighlightCode,
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)

    const config = shallowRef<DocPageConfig>({})

    const docId = computed<string | undefined>(() => {
      const params = router.currentRoute.value.params
      const id = camelize(params.slug as string)

      return id
    })

    const subHeaders = computed(() => {
      return config.value.attributes || {}
    })

    const getContent = async (): Promise<void> => {
      loading.value = true

      const c = await getDocConfig(docId.value)

      config.value = markRaw(c || {})

      loading.value = false
    }

    onServerPrefetch(async () => {
      await getContent()
    })

    watch(
      () => router.currentRoute.value.path,
      () => {
        getContent()
      },
      { immediate: true },
    )

    const metaTitle = computed(() => {
      const r = router.currentRoute.value
      const routeTitle = `${toLabel((r.name || r.path) as string)}`
      const getTitle = config.value.attributes?.title ?? routeTitle
      return getTitle
    })

    const metaDescription = computed(() => {
      return config.value.attributes?.description ?? ""
    })

    useMeta({
      title: metaTitle,
      meta: [
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:title",
          content: metaTitle,
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:title",
          content: metaTitle,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
      ],
    })

    return { config, loading, subHeaders, getContent }
  },
}
</script>
<style lang="less">
@import "@factor/ui/entry.less";
</style>
