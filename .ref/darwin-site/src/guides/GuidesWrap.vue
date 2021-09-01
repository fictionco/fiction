<template>
  <div class="guides w-full max-w-7xl mx-auto">
    <div class="lg:flex mb-12">
      <GuideSidebar :menu="menu" :title="title" />
      <GuideDoc :content="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { MarkdownFile, MenuItem } from "@factor/types"
import { computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

import { guideConfig } from "./config"
import GuideDoc from "./GuideDoc.vue"
import GuideSidebar from "./GuideSidebar.vue"
export default {
  components: {
    GuideSidebar,
    GuideDoc,
  },
  setup() {
    const route = useRoute()
    const guide = computed(() => route.params.guide as string)
    const subGuide = computed(() => route.params.subGuide as string)

    const title = computed(() => {
      const conf = guideConfig.find((g) => g.guide == guide.value)
      return conf?.title ?? conf?.name
    })

    /**
     * Create the navigation menu based on config array
     */
    const menu = computed(() => {
      const out: MenuItem[] = []
      guideConfig.forEach((g) => {
        if (g.guide == guide.value) {
          out.push({ name: g.name, route: `/guides/${g.guide}/` })

          if (g.children) {
            g.children.forEach((gg) => {
              out.push({
                name: gg.name,
                route: `/guides/${g.guide}/${gg.guide}`,
              })
            })
          }
        }
      })

      return out
    })

    /**
     * Get the content based on the current route and associated markdown file
     */
    const getContent = async (): Promise<string> => {
      const guideParent = guideConfig.find((g) => g.guide == guide.value)
      let file: (() => Promise<MarkdownFile>) | undefined
      if (subGuide.value) {
        const sub = guideParent?.children.find(
          (gg) => gg.guide == subGuide.value,
        )
        file = sub?.file
      } else {
        file = guideParent?.file
      }

      if (file) {
        const fileData = await file()
        return fileData.html
      } else {
        return "no file"
      }
    }

    const content = ref("")

    onMounted(async () => {
      content.value = await getContent()
    })

    watch(
      () => route.path,
      async () => {
        content.value = await getContent()
      },
    )

    return { guide, subGuide, menu, content, title }
  },
}
</script>
