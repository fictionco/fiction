<template>
  <div class="flex w-full">
    <div
      class="doc-selector min-h-screen min-w-0 flex-auto px-4 py-12 pb-24 sm:px-6 lg:pb-16 xl:px-8"
    >
      <HighlightCode v-if="config.component" class="shadow-none">
        <div class="entry m-auto max-w-prose lg:px-6">
          <h1 class="mb-12 border-b border-slate-200 pb-6">
            {{ config?.title }}
          </h1>
          <div class="toc-content entry">
            <component :is="config.component" />
          </div>
        </div>
      </HighlightCode>
    </div>
    <div class="mr-8 hidden w-64 flex-none pl-8 pt-14 xl:block xl:text-sm">
      <EntryToc selector=".toc-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HighlightCode from "@factor/plugin-highlight-code/HighlightCode.vue"
import { useMeta, camelize, toLabel } from "@factor/api"
import { useRouter } from "vue-router"
import {
  shallowRef,
  ref,
  computed,
  onServerPrefetch,
  watch,
  markRaw,
} from "vue"

import { DocPageConfig } from "@factor/plugin-docs-engine"
import EntryToc from "@factor/ui/EntryToc.vue"
import { factorDocs } from "@factor/site"

const router = useRouter()
const loading = ref(false)

const config = shallowRef<DocPageConfig>({})

const docId = computed<string | undefined>(() => {
  const params = router.currentRoute.value.params
  const id = camelize(params.slug as string)

  return id
})

const getContent = async (): Promise<void> => {
  loading.value = true

  const c = await factorDocs.getDocConfig(docId.value)

  config.value = markRaw(c || {})

  loading.value = false
}

onServerPrefetch(async () => {
  await getContent()
})

watch(
  () => router.currentRoute.value.path,
  async () => {
    await getContent()
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
</script>
<style lang="less">
@import "@factor/ui/entry.less";
</style>
