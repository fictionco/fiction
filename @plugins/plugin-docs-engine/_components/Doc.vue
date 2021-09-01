<template>
  <div class="w-full flex">
    <div
      class="
        doc-selector
        min-w-0
        flex-auto
        px-4
        py-12
        pb-24
        sm:px-6
        xl:px-8
        lg:pb-16
        min-h-screen
      "
    >
      <div v-if="loading" class="p-12">
        <ElemSpinner class="text-bluegray-200 w-12 h-12 m-auto" />
      </div>

      <DocEntry v-else :config="config" />
    </div>
    <div class="hidden xl:text-sm xl:block flex-none w-64 pl-8 mr-8">
      <DocToc selector=".doc-selector" />
    </div>
  </div>
</template>

<script lang="ts">
import { useMeta, camelize, toLabel } from "@factor/api"
import { useRouter } from "vue-router"
import ElemSpinner from "@factor/ui/ElemSpinner.vue"
import {
  shallowRef,
  ref,
  computed,
  onServerPrefetch,
  watch,
  markRaw,
} from "vue"
import { DocPageConfig } from "../types"
import { docSetting, getDocConfig } from "../helpers"
import DocEntry from "./DocEntry.vue"
import DocToc from "./DocToc.vue"
export default {
  components: {
    ElemSpinner,
    DocEntry,
    DocToc,
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const nav = ref(docSetting("map"))
    const config = shallowRef<DocPageConfig>({})

    const docId = computed<string | undefined>(() => {
      const params = router.currentRoute.value.params
      const id = camelize(params.docSlug as string)

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

    return { nav, config, loading, subHeaders, getContent }
  },

  // metaInfo(this: any) {
  //   return {
  //     title: this.config.meta?.title ?? toLabel(this.doc),
  //     description: this.config.meta?.description,
  //   }
  // },
}
</script>
