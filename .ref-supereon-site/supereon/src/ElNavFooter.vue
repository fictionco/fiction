F
<script lang="ts" setup>
import { vue } from '@factor/api'

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
</script>

<template>
  <div class="flex items-center space-x-2 text-xs tracking-tight md:text-sm">
    <RouterLink
      v-for="(m, i) in menu"
      :key="i"
      class="hover:bg-theme-700 hover:text-primary-50 cursor-pointer rounded-md px-2 py-0.5 font-medium"
      :to="m.href"
    >
      {{ m.name }}
    </RouterLink>
  </div>
</template>
