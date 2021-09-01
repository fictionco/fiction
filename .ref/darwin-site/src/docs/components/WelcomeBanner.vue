<template>
  <div>
    <div
      class="
        bg-white
        rounded-lg
        overflow-hidden
        lg:grid lg:grid-cols-2 lg:gap-4
        border border-bluegray-300
      "
    >
      <div
        class="
          pt-10
          pb-12
          px-6
          sm:pt-16 sm:px-16
          lg:py-16 lg:pr-0
          xl:py-20 xl:px-20
          flex flex-col
          justify-center
        "
      >
        <div class="lg:self-center">
          <div class="uppercase text-xs mb-2 font-semibold text-bluegray-400">
            Documentation
          </div>
          <h2 class="text-xl xl:text-3xl font-bold">
            <span class="block">Welcome to Darwin Docs</span>
          </h2>
          <p class="mt-4 text-ll leading-6 text-bluegray-500">
            Here you can learn all about how to use and leverage Darwin's tools
            to evolve your site and create results for your business.
          </p>

          <div class="mt-6">
            <ElemButton btn="primary" to="/docs/install"
              >Install Darwin &rarr;</ElemButton
            >
          </div>
        </div>
      </div>
      <div class="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
        <img
          class="
            transform
            translate-x-6 translate-y-6
            rounded-md
            object-cover object-left-top
            sm:translate-x-16
            lg:translate-y-20
            shadow-xl
            ring-1 ring-black ring-opacity-10
          "
          :src="screenshot"
          alt="App screenshot"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import screenshot from "../../_home/screenDashboard.webp"
import ElemButton from "../../el/ElemButton.vue"
export default {
  name: "UpgradeBanner",
  components: {
    ElemButton,
  },
  props: {
    title: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  setup() {
    return { screenshot }
  },
}
</script>
