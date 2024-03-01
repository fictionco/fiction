<script lang="ts" setup>
import { dayjs, vue } from '@factor/api'

interface Column {
  heading?: string
  class?: string
  menu?: { path: string, name: string, target?: string }[]
}
const columns = vue.ref<Column[]>([
  {
    heading: 'Links',
    menu: [
      { path: '/about', name: 'About' },
      { path: '/pricing', name: 'Pricing' },
      { path: '/blog', name: 'News &amp; Updates' },
    ],
  },
])
</script>

<template>
  <footer class="mx-auto mt-6 w-full max-w-screen-xl py-12">
    <div
      v-for="(col, i) in columns"
      :key="i"
      class="text-theme-500 relative"
    >
      <ul
        v-if="col.menu"
        class="justify-center space-y-4 text-center text-xs font-bold uppercase tracking-widest md:flex md:space-x-8 md:space-y-0"
      >
        <li v-for="(item, ii) in col.menu" :key="ii">
          <a
            :href="item.path"
            :target="item.target ? item.target : '_self'"
            class="hover:text-theme-800"
            v-html="item.name"
          />
        </li>
      </ul>
    </div>
    <div class="text-theme-300 my-6 text-center text-xs font-medium">
      Copyright &copy; {{ dayjs().format("YYYY") }} &middot;
      <RouterLink to="/docs/privacy-policy" class="underline">
        Privacy
      </RouterLink>
      /
      <RouterLink to="/docs/tos" class="underline">
        Terms
      </RouterLink>
    </div>
    <div class="mt-8 text-center">
      <a
        href="https://www.fiction.com"
        class="text-theme-300 hover:text-theme-800"
      >
        <svg
          class="inline-block h-8 w-8"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  </footer>
</template>
