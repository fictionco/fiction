<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardSocials from '../el/CardSocials.vue'
import CardNavLink from '../CardNavLink.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const nav = vue.computed(() => uc.value.nav || [])

const footer = [
  `&copy; ${uc.value.legal?.copyrightText}`,
  `<a class="dark:hover:text-theme-100" href="${uc.value.legal?.termsOfService}">Terms of Service</a>`,
  `<a class="dark:hover:text-theme-100" href="${uc.value.legal?.privacyPolicy}">Privacy Policy</a>`,
].filter(Boolean).join(' <span class="opacity-70 mx-1 i-tabler-slash"></span> ')

const layoutClasses = vue.computed(() => {
  const l = uc.value.layout || 'centered'

  if (l === 'centered') {
    return {
      wrapClass: 'flex flex-col items-center gap-12',
      logoClass: 'order-3',
      navClass: 'order-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-x-8 md:gap-x-20 xl:gap-x-48 gap-y-12 ',
      badgeClass: 'order-2',
      badgeWrap: `items-center`,
      socials: `justify-center md:justify-center`,
    }
  }
  else {
    return {
      wrapClass: 'flex flex-col items-center  lg:items-start lg:flex-row gap-6',
      logoClass: 'w-60 lg:basis-[250px] flex justify-center lg:justify-start',
      navClass: `flex flex-col lg:flex-row items-center lg:items-start my-8 lg:my-0 justify-center gap-x-8 md:gap-x-20 xl:gap-x-48 gap-y-12 basis-[80%] grow`,
      badgeClass: `text-sm lg:flex-row lg:items-center lg:justify-between lg:basis-[250px]`,
      badgeWrap: `items-center lg:items-end`,
      socials: `justify-center lg:justify-end`,
    }
  }
})
</script>

<template>
  <div class="z-10" :class="card.classes.value.contentWidth">
    <div class=" px-4 lg:px-0">
      <div :class="layoutClasses.wrapClass">
        <div :class="layoutClasses.logoClass">
          <a href="/" class="block size-8 md:size-12"><ElImage :media="uc.logo" /></a>
        </div>
        <div :class="layoutClasses.navClass">
          <div
            v-for="(col, i) in nav"
            :key="i"
          >
            <h3
              v-if="col.itemsTitle"
              class="mb-3 md:mb-6 text-left font-sans text-xs text-theme-500 dark:text-theme-500 font-medium uppercase tracking-widest"
            >
              {{ col.itemsTitle }}
            </h3>
            <ul v-if="col.items" class="space-y-3">
              <li
                v-for="(item, ii) in col.items"
                :key="ii"
                class="text-left"
              >
                <CardNavLink
                  :card
                  :item="item"
                  class="hover:text-primary-500 text-theme-800 dark:text-theme-50 dark:hover:text-theme-300 font-sans text-sm font-semibold"
                />
              </li>
            </ul>
          </div>
        </div>
        <div :class="layoutClasses.badgeClass">
          <CardSocials v-if="uc.socials" :class="layoutClasses.socials" :socials="uc.socials" />

          <div :class="layoutClasses.badgeWrap" class="text-theme-700 dark:text-theme-50 mt-5 text-right text-xs flex flex-col items-center  d gap-4  ">
            <div v-for="(badge, i) in uc.badges" :key="i">
              <a :href="card.link(badge.href)" :title="badge.name" class="inline-block">
                <ElImage :media="badge.media" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-20">
        <div class="flex flex-col gap-2 mb-4 justify-center items-center">
          <div class="flex gap-1 justify-center items-center">
            <div v-for="(s) in 5" :key="s" class="text-xl i-tabler-star-filled text-yellow-800/80" />
          </div>
          <div class="text-xs font-sans text-theme-400 dark:text-theme-600">
            Satisfaction Guaranteed
          </div>
        </div>
        <div class="text-theme-300 dark:text-theme-500 my-6 text-center text-xs font-sans flex items-center justify-center" v-html="footer" />
      </div>
      <div class="text-center">
        <a href="https://www.fiction.com" title="Powered by Fiction.com" class="text-theme-400 dark:text-theme-600/80 dark:hover:text-primary-400 hover:text-primary-500">
          <svg class="size-8 inline-block" preserveAspectRatio="xMidYMid meet" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z" fill="currentColor" /></svg>
        </a>
      </div>
    </div>
  </div>
</template>
