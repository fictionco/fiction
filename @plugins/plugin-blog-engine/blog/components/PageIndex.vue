<template>
  <div class="bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
    <div class="relative">
      <div>
        <h2 class="text-3xl tracking-tight font-extrabold sm:text-4xl">
          {{ title }}
        </h2>
        <p class="mt-3 text-xl text-bluegray-500 sm:mt-4">
          {{ description }}
        </p>
      </div>
      <PostList></PostList>
    </div>
  </div>
</template>

<script lang="ts">
import PostList from "./PostList.vue"

import dayjs from "dayjs"
import { useMeta } from "@factor/api"
export default {
  components: {
    PostList,
  },
  setup() {
    const title = "Blog"

    const description = "News and Insights"

    useMeta({
      title: title,
      meta: [
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: description,
        },
      ],
    })

    return {
      dayjs,
      title,
      description,
    }
  },
}
</script>
