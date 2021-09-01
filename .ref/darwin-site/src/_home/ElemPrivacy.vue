<template>
  <div class="mx-auto max-w-sm md:max-w-xl lg:max-w-7xl px-4 py-12 lg:px-10">
    <div
      class="
        rounded-lg
        py-12
        lg:py-8 lg:flex lg:items-center lg:justify-between
      "
    >
      <h2>
        <span class="block text-3xl font-extrabold">{{ title }}</span>
        <span
          class="
            block
            mt-2
            text-bluegray-500 text-base
            leading-relaxed
            md:text-xl
          "
          >{{ subtitle }}</span
        >
      </h2>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex">
          <router-link
            to="/docs/gdpr"
            class="inline-flex items-center justify-center"
          >
            <img :src="logoGDPR" alt="GDPR" />
          </router-link>
        </div>
        <div class="ml-3 inline-flex">
          <router-link
            to="/docs/ccpa"
            class="inline-flex items-center justify-center"
          >
            <img :src="logoCCPA" alt="CCPA" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { isDev } from "@factor/api"
import logoCCPA from "../img/logo-ccpa.svg"
import logoGDPR from "../img/logo-gdpr.svg"
export default {
  props: {
    title: { type: String, default: "GDPR and CCPA" },
    subtitle: {
      type: String,
      default:
        "Personal data protection and privacy are core values of Darwin Analytics.",
    },
  },
  setup() {
    return { logoGDPR, logoCCPA, isDev }
  },
}
</script>
