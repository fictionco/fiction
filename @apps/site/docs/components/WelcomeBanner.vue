<template>
  <div>
    <div
      class="overflow-hidden rounded-lg border border-slate-300 bg-white lg:grid lg:grid-cols-2 lg:gap-4"
    >
      <div
        class="flex flex-col justify-center px-6 pt-10 pb-12 sm:pt-16 sm:pl-16 lg:py-16 lg:pr-0 xl:py-20 xl:pl-20"
      >
        <div class="lg:self-center">
          <div class="mb-2 text-xs font-semibold uppercase text-slate-400">
            Documentation
          </div>
          <h2 class="text-xl font-extrabold xl:text-5xl">
            <span class="block">The Docs</span>
          </h2>
          <p class="mt-4 text-lg leading-6 text-slate-500">
            Here you can learn all about how to use and leverage Factor to
            create blogs, apps and websites.
          </p>

          <div class="mt-6 flex space-x-3">
            <ElButton btn="primary" size="md" to="/docs/quickstart"
              >Quickstart &rarr;</ElButton
            >
            <ElButton
              btn="default"
              size="md"
              href="https://github.com/FactorJS/factor-hello-world"
              >Hello World Example
            </ElButton>
          </div>
        </div>
      </div>
      <div
        v-if="screenshot"
        class="aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 -mt-6"
      >
        <img
          class="translate-x-6 translate-y-6 rounded-md object-cover object-left shadow-xl ring-1 ring-black/10 sm:translate-x-16 lg:translate-y-20"
          :src="screenshot"
          alt="App screenshot"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ElButton from "@factor/ui/ElButton.vue"
import screenshot from "../screenshot.webp"

defineProps({
  title: { type: String, default: "" },
  note: { type: String, default: "" },
})
</script>
