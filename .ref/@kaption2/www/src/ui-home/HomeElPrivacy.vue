<script lang="ts" setup>
import logoCCPA from '../img/logo-ccpa.svg'
import logoGDPR from '../img/logo-gdpr.svg'

defineProps({
  title: { type: String, default: 'GDPR and CCPA' },
  subtitle: {
    type: String,
    default: 'Personal data protection and privacy are always respected',
  },
})
</script>

<template>
  <div class="mx-auto max-w-sm px-4 py-12 md:max-w-xl lg:max-w-7xl lg:px-10">
    <div
      class="rounded-lg py-12 lg:flex lg:items-center lg:justify-between lg:py-8"
    >
      <h2>
        <span class="block text-3xl font-extrabold">{{ title }}</span>
        <span
          class="mt-2 block text-base leading-relaxed text-theme-500 md:text-xl"
        >{{ subtitle }}</span>
      </h2>
      <div class="mt-8 flex lg:mt-0 lg:shrink-0">
        <div class="inline-flex">
          <router-link
            to="/docs/gdpr"
            class="inline-flex items-center justify-center"
          >
            <img :src="logoGDPR" alt="GDPR">
          </router-link>
        </div>
        <div class="ml-3 inline-flex">
          <router-link
            to="/docs/ccpa"
            class="inline-flex items-center justify-center"
          >
            <img :src="logoCCPA" alt="CCPA">
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
