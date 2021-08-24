<template>
  <div>
    <div class="overflow-visible">
      <section
        class="
          pt-12
          lg:pt-28
          mx-auto
          max-w-7xl
          px-4
          md:px-20
          lg:px-12
          text-center
        "
      >
        <h1
          class="
            mb-4
            text-3xl
            font-extrabold
            md:mb-10
            sm:text-4xl
            lg:text-6xl
            xl:text-7xl
            m-auto
            leading-relaxed
          "
        >
          It’s Darwin's Business
          <span class="lg:block">to Grow Yours</span>
        </h1>
        <p class="mb-12 text-2xl lg:text-4xl text-bluegray-400 m-auto lg:mb-20">
          Built to improve experiences for your customers.
        </p>
      </section>

      <div
        class="
          gap-10
          mx-auto
          max-w-7xl
          px-4
          md:px-20
          lg:px-12
          py-12
          shadow-lg
          ring-1 ring-black ring-opacity-10
          rounded-md
          md:grid md:grid-cols-12
          my-32
        "
      >
        <div class="relative md:col-span-6">
          <div class="my-6">
            <div class="uppercase text-primary-500 font-medium">About Us</div>
            <p class="text-4xl font-extrabold my-3">Long story short...</p>
            <div class="text-bluegray-600 text-xl">
              <p class="mt-5">
                The frustrations that led to Darwin came from working online and
                wishing there was a better way to quantify and analyze web
                traffic.
              </p>
              <p class="mt-5">
                We tried almost every analytics other tool, and none of them
                made it possible to understand the needs of our customers.
                That's why we started working on Darwin.
              </p>
            </div>
          </div>
        </div>
        <div class="md:col-start-8 md:col-end-13">
          <div class="mt-12 grid grid-cols-2 gap-y-12 gap-x-12 sm:grid-cols-2">
            <p class="text-center lg:text-left">
              <span class="block text-6xl font-bold text-primary-600"
                >2020</span
              >
              <span class="mt-1 block text-base text-bluegray-500">
                Founded</span
              >
            </p>
            <p class="text-center lg:text-left">
              <span class="block text-6xl font-bold text-primary-600"
                >2021</span
              >
              <span class="mt-1 block text-base text-bluegray-500">
                Launched</span
              >
            </p>
            <p class="text-center lg:text-left">
              <span class="block text-6xl font-bold text-primary-600"
                >$1.2m</span
              >
              <span class="mt-1 block text-base text-bluegray-500">
                Funding</span
              >
            </p>

            <p class="text-center lg:text-left">
              <span class="block text-6xl font-bold text-primary-600">5</span>
              <span class="mt-1 block text-base text-bluegray-500">
                People</span
              >
            </p>
          </div>
        </div>
      </div>

      <ElemTeam />

      <ElemDirections />

      <ElemCta />
    </div>
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
import ElemTeam from "./ElemTeam.vue"
import ElemDirections from "./ElemDirections.vue"
import ElemCta from "../_home/ElemCta.vue"

export default {
  components: {
    ElemTeam,
    ElemDirections,
    ElemCta,
  },
  setup() {
    const metaTitle = "About Darwin Analytics"

    const metaDescription =
      "We tried almost every analytics other tool, and none of them made it possible to understand the needs of our customers. That's why we started working on Darwin."

    useMeta({
      title: metaTitle,
      meta: [
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
          name: "twitter:title",
          content: metaTitle,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
      ],
    })
  },
}
</script>
