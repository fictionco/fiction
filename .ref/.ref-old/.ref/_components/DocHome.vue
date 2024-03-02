<template>
  <div>
    <div class="px-4 sm:px-6 xl:px-8 pt-10 pb-16">
      <h1 class="text-5xl font-bold text-gray-500 mb-4">Documentation</h1>
      <p class="text-2xl text-color-500 mb-16">
        Learn how to ship professional Factor apps, build plugins, and create
        themes.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
        <router-link
          v-for="(group, i) in boxes"
          :key="i"
          :to="group.path"
          class="
            flex
            overflow-hidden
            border border-gray-100
            p-6
            bg-white
            rounded-lg
            transition-shadow
            shadow
            hover:shadow-lg
          "
        >
          <div v-if="group.boxIcon" class="mr-4" v-html="group.boxIcon" />
          <div v-else class="mr-4">
            <svg
              class="h-8 w-8 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.66 4.52l2.83 2.83-2.83 2.83-2.83-2.83 2.83-2.83M9 5v4H5V5h4m10 10v4h-4v-4h4M9 15v4H5v-4h4m7.66-13.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65zM11 3H3v8h8V3zm10 10h-8v8h8v-8zm-10 0H3v8h8v-8z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold mb-2 text-shadow">
              {{ group.title }}
            </h2>
            <p class="text-color-500">
              {{ group.description }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from "vue"

import { docSetting } from "../helpers"
import { DocsNavGroup } from "../types"

export default {
  setup() {
    const loaded = ref<boolean>(false)
    const selectedGroup = ref("")
    const settingBaseRoute = ref(docSetting("baseRoute"))

    const baseRoute = computed(() => {
      return settingBaseRoute.value ?? "/docs"
    })

    const settingNav = ref(docSetting("nav"))

    const boxes = computed(() => {
      return settingNav.value
        .filter((_: DocsNavGroup) => _.title)
        .map((_: DocsNavGroup) => {
          if (_.items && _.items.length > 0) {
            const { path, docName } = _.items[0]
            _.path = path || `${settingBaseRoute.value}/${docName}`
          }

          return _
        })
    })

    onMounted(() => {
      setTimeout(() => {
        loaded.value = true
      }, 100)
    })

    return { baseRoute, selectedGroup, boxes }
  },
  metaInfo: () => {
    return {
      title: docSetting("titleTag"),
      description: docSetting("metaDescription"),
    }
  },
}
</script>
