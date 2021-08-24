<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:flex justify-between items-center py-8">
      <div>
        <h2 class="text-3xl font-bold">Plugins</h2>
        <div class="text-color-500">
          Create and run your web app with Factor and extensions.
        </div>
      </div>
      <div class="mt-3 lg:mt-0">
        <ElemButton
          btn="default"
          to="/plugins"
          class="font-bold hover:text-primary-500"
        >
          Browse All &rarr;
        </ElemButton>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <router-link
        v-for="(item, i) in plugins"
        :key="i"
        class="group flex py-4 pr-4 rounded-lg transition-all hover:shadow-xl"
        :to="`/plugin/${item.path}`"
      >
        <img
          :src="item.icon"
          :alt="item.title"
          class="
            w-24
            h-24
            mr-8
            rounded-lg
            shadow-lg
            flex-shrink-0
            transition
            duration-300
            ease-in-out
            origin-top-right
            transform
            scale-100
            group-hover:scale-75
          "
        />
        <div class="min-w-0">
          <h1 class="text-3xl mb-2 font-bold">{{ item.title }}</h1>
          <p class="line-clamp-2 text-color-500 text-xl">
            {{ item.content }}
          </p>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { ref } from "vue"
import ElemButton from "@factor/ui/ElemButton.vue"

import IconBlog from "../img/icon-plugin-blog.svg"

export default {
  components: {
    ElemButton,
  },
  setup() {
    const plugins = ref([
      {
        path: "standard-blog",
        icon: IconBlog,
        title: "Standard Blog",
        content:
          "A standard blog plugin that can be easily customized to meet any blogging need in your Factor app.",
      },
    ])

    return { plugins }
  },
}
</script>
