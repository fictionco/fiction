<template>
  <div class="max-w-screen-3xl m-auto my-12 mx-4 sm:-mx-16 lg:-mx-36">
    <div class="widget-translate grid grid-cols-1 gap-4 sm:grid-cols-12">
      <div
        v-for="(w, i) in map"
        :key="i"
        class="
          col-span-1
          sm:col-span-4
          lg:col-span-2
          relative
          rounded-lg
          border border-gray-300
          bg-white
          px-8
          py-6
          shadow-sm
          flex
          items-center
          space-x-6
          hover:border-gray-400
          focus-within:ring-2
          focus-within:ring-offset-2
          focus-within:ring-indigo-500
        "
      >
        <div class="flex-shrink-0" :class="w.textColor">
          <div class="h-6 w-6" v-html="w.icon" />
        </div>
        <div class="flex-1 min-w-0 text-left">
          <a href="#" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-lg font-bold">{{ w.title }}</p>
            <p class="text-sm text-bluegray-500 truncate">
              {{ w.description }}
            </p>
          </a>
        </div>
      </div>

      <!-- More people... -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue"

import { widgetDataMap } from "@darwin_/query/_widgets/map"
export default {
  setup() {
    const colors = [
      "text-primary-500",
      "text-green-500",
      "text-pink-500",
      "text-red-500",
      "text-orange-500",
      "text-blue-500",
    ]
    const map = computed(() => {
      return Object.values(widgetDataMap)
        .filter((_) => _.custom)
        .map((_) => {
          const rando = Math.floor(Math.random() * colors.length)
          return {
            ..._,
            textColor: colors[rando],
          }
        })
    })
    return { map }
  },
}
</script>
<style lang="less"></style>
