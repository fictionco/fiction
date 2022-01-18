<template>
  <div>
    <div
      class="bg-white rounded-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4 border border-slate-300"
    >
      <div
        class="pt-10 pb-12 px-6 sm:pt-16 sm:pl-16 lg:py-16 lg:pr-0 xl:py-20 xl:pl-20 flex flex-col justify-center"
      >
        <div class="lg:self-center">
          <div class="uppercase text-xs mb-2 font-semibold text-slate-400">
            Documentation
          </div>
          <h2 class="text-xl xl:text-5xl font-extrabold">
            <span class="block">The Docs</span>
          </h2>
          <p class="mt-4 leading-6 text-slate-500 text-lg">
            Here you can learn all about how to use and leverage Factor to
            create blogs, apps and websites.
          </p>

          <div class="mt-6 flex space-x-3">
            <ElemButton btn="primary" size="md" to="/docs/quickstart"
              >Quickstart &rarr;</ElemButton
            >
            <ElemButton
              btn="default"
              size="md"
              href="https://github.com/FactorJS/factor-hello-world"
              >Hello World Example
            </ElemButton>
          </div>
        </div>
      </div>
      <div
        v-if="screenshot"
        class="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1"
      >
        <img
          class="transform translate-x-6 translate-y-6 rounded-md object-cover object-left sm:translate-x-16 lg:translate-y-20 shadow-xl ring-1 ring-black ring-opacity-10"
          :src="screenshot"
          alt="App screenshot"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import screenshot from "../screenshot.webp"
import ElemButton from "@factor/ui/ElemButton.vue"

defineProps({
  title: { type: String, default: "" },
  note: { type: String, default: "" },
})
</script>
