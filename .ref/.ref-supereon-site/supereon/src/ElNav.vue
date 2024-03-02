<script lang="ts" setup>
import { onResetUi, vue } from '@factor/api'

const menu = vue.ref([
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Blog',
    href: '/blog',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
])
const mobileVis = vue.ref(false)
onResetUi(() => {
  mobileVis.value = false
})
</script>

<template>
  <div>
    <div class="hidden items-center space-x-2 tracking-tight md:flex">
      <RouterLink
        v-for="(m, i) in menu"
        :key="i"
        class="hover:bg-theme-800 hover:text-primary-50 cursor-pointer rounded-md px-3 py-1 font-medium"
        :to="m.href"
      >
        {{ m.name }}
      </RouterLink>
    </div>
    <div
      v-if="mobileVis"
      class="bg-theme-0 text-theme-800 border-theme-300 fixed inset-x-3 top-3 z-30 flex justify-between rounded-md border p-6 text-xl shadow-lg"
      @click.stop
    >
      <div class="space-y-3">
        <RouterLink
          v-for="(m, i) in menu"
          :key="i"
          class="hover:bg-theme-800 hover:text-primary-50 block cursor-pointer rounded-md px-3 py-1 font-medium"
          :to="m.href"
        >
          {{ m.name }}
        </RouterLink>
      </div>
      <div class="flex flex-col justify-between">
        <div
          class="i-heroicons-x-mark text-4xl"
          @click="mobileVis = false"
        />
        <RouterLink to="/" class="text-theme-800 p-2 text-right">
          <svg
            class="inline-block w-6"
            viewBox="0 0 234 315"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M116.627 0.000110954C85.7087 0.0425306 56.0688 12.3317 34.2062 34.1732C12.3436 56.0147 0.0424606 85.626 0 116.514V124.532H43.8689V116.514C43.8246 100.958 48.7954 85.8016 58.0454 73.2877C67.2953 60.7739 80.3327 51.5682 95.2276 47.0334V189.737H61.5234V233.563H95.2276V314.268H139.096V233.563H172.801V189.737H139.096V47.0334C153.803 51.8082 166.629 61.0916 175.753 73.5647C184.877 86.0378 189.834 101.066 189.92 116.514V124.532H233.789V116.514C233.69 85.5508 221.297 55.8915 199.331 34.0469C177.365 12.2024 147.621 -0.042522 116.627 0.000110954Z"
              fill="currentColor"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
    <div
      class="group flex h-8 w-6 cursor-pointer flex-col justify-center space-y-1 md:hidden"
      @click.stop="mobileVis = true"
    >
      <div
        class="bg-theme-500 group-active:bg-theme-400 h-1 rounded-full"
      />
      <div
        class="bg-theme-500 group-active:bg-theme-400 h-1 rounded-full"
      />
      <div
        class="bg-theme-500 group-active:bg-theme-400 h-1 rounded-full"
      />
    </div>
  </div>
</template>
