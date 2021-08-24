<template>
  <div class="max-w-7xl mt-24 mx-auto px-8 lg:mt-36 xl:mb-20">
    <div
      class="rounded-lg bg-gradient-to-br from-primary-500 via-primary-900 to-gray-900 shadow-2xl relative overflow-hidden"
    >
      <div
        class="relative z-30 items-center p-10 lg:p-16 lg:grid lg:grid-cols-3 lg:gap-8"
      >
        <div class="col-span-2">
          <h2
            class="text-3xl font-bold text-gray-100 sm:text-4xl sm:leading-tight"
          >
            {{ title }}
          </h2>
          <p
            class="mt-3 text-primary-200 sm:text-lg md:mt-5 md:text-xl md:leading-relaxed"
          >
            {{ subtitle }}
          </p>
        </div>
        <div class="col-span-1 mt-8 lg:justify-self-end lg:mt-0">
          <a
            :href="buttonLink"
            class="ml-auto inline-flex justify-center rounded-md transition-colors bg-primary-500 text-gray-100 hover:text-white"
          >
            <ElemButton
              class="px-5 py-3 sm:mt-0 md:px-8 focus:ring-opacity-0 md:py-3 md:text-lg"
            >
              {{ buttonText }}
              <ElemHoverArrow size="large" />
            </ElemButton>
          </a>
        </div>
      </div>

      <svg
        class="w-auto h-full absolute max-w-lg bottom-0 left-0 lg:block"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 227 222"
      >
        <path
          fill="url(#curve3_linear)"
          fill-opacity=".1"
          d="M0 0v106.5c67.2 0 113.5 52 113.5 116h113C226.5 134 160 0 0 0z"
        />
        <path
          fill="url(#curve4_linear)"
          fill-opacity=".1"
          d="M0 20v86.5c67.2 0 113.5 52 113.5 116h76C176.5 95 45 20 0 20z"
        />
        <defs>
          <linearGradient
            id="curve3_linear"
            x1="212.964"
            x2="95.349"
            y1="217.735"
            y2="-17.217"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#fff" stop-opacity="0" />
            <stop offset=".495" stop-color="#fff" />
            <stop offset="1" stop-color="#fff" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="curve4_linear"
            x1="164"
            x2="18.602"
            y1="217"
            y2="48.91"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#fff" stop-opacity="0" />
            <stop offset=".495" stop-color="#fff" />
            <stop offset="1" stop-color="#fff" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import ElemButton from "@factor/ui/ElemButton.vue"

import ElemHoverArrow from "./ElemHoverArrow.vue"

export default {
  components: {
    ElemButton,
    ElemHoverArrow,
  },
  props: {
    title: { type: String, default: "Know someone we should talk to?" },
    subtitle: {
      type: String,
      default:
        "Find a deal for us and we'll make it worth your while! We pay finders fees, all you have to do is introduce us.",
    },
    buttonLink: { type: String, default: "mailto:hello@fiction.com" },
    buttonText: { type: String, default: "Send a Lead" },
  },
}
</script>
