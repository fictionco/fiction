<script lang="ts" setup>
import { dayjs, useService, vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import ElImage from '@fiction/ui/media/ElImage.vue'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import CardSocials from '../el/CardSocials.vue'
import CardNavLink from '../CardNavLink.vue'
import CardText from '../CardText.vue'
import { processNavItems } from '../utils/nav'
import ElBrand from '../el/ElBrand.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

const { fictionUser, fictionRouter } = useService()

const nav = vue.computed(() => {
  const n = uc.value.nav || []

  return processNavItems({ items: n, fictionUser, fictionRouter, basePathPrefix: 'nav' })
})

const layoutClasses = vue.computed(() => {
  const l = uc.value.layout || 'columns'

  if (l === 'centered') {
    return {
      wrapClass: 'flex flex-col items-center gap-12',
      logoClass: 'order-3 flex flex-col items-center gap-4 lg:gap-6 text-center',
      navClass: 'order-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-x-8 md:gap-x-20 xl:gap-x-36 gap-y-12 ',
      badgeClass: 'order-2',
      badgeWrap: `items-center`,
      socials: `justify-center md:justify-center`,
    }
  }
  else {
    return {
      wrapClass: 'flex flex-col items-center  lg:items-start lg:flex-row gap-6',
      logoClass: 'w-60 lg:basis-[250px] flex flex-col items-center lg:items-start gap-4 lg:gap-6 text-center lg:text-left',
      navClass: `grid grid-cols-2 md:flex flex-row items-start my-8 lg:my-0 justify-center gap-x-8 md:gap-x-20 xl:gap-x-36 gap-y-12 basis-[80%] grow`,
      badgeClass: `text-sm lg:flex-row lg:items-center lg:justify-between lg:basis-[250px]`,
      badgeWrap: `items-center lg:items-end`,
      socials: `justify-center lg:justify-end`,
    }
  }
})

const loaded = vue.ref(false)

const highlightStar = vue.ref(-1)

function startHighlightStar() {
  let dur = 225

  if (highlightStar.value > 5) {
    highlightStar.value = -1
    dur = 15000
  }

  setTimeout(() => {
    highlightStar.value = highlightStar.value + 1
    startHighlightStar()
  }, dur)
}

vue.onMounted(() => {
  useElementVisible({
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'pop', config: { overallDelay: 200 } })
      loaded.value = true

      await waitFor(1000)
      startHighlightStar()
    },
  })
})
</script>

<template>
  <div class="z-10" :class="card.classes.value.contentWidth">
    <div class=" px-4 lg:px-0">
      <div :class="layoutClasses.wrapClass">
        <div :class="layoutClasses.logoClass" class="text-primary-500 dark:text-theme-0">
          <ElBrand :logo="uc.logo" :card />
          <CardText
            class="text-base text-theme-400 dark:text-theme-5 00 x-font-title leading-tight text-balance font-medium"
            :card
            tag="h2"
            path="tagline"
            animate="rise"
          />
        </div>
        <div :class="layoutClasses.navClass">
          <div
            v-for="(col, i) in nav"
            :key="i"
          >
            <CardText
              class="mb-3 md:mb-4 text-left font-sans text-xs text-theme-400 dark:text-theme-600 font-medium uppercase tracking-widest"
              :card
              :tag="col.href ? 'a' : 'h3'"
              :path="`nav.${i}.name`"
              animate="fade"
              :href="col.href"
              :title="col.desc"
            />
            <ul v-if="col.items" class="space-y-3">
              <li
                v-for="(item, ii) in col.items"
                :key="ii"
                class="text-left"
              >
                <CardNavLink
                  :card
                  :item
                  class="hover:text-primary-500 text-theme-800 dark:text-theme-50 dark:hover:text-theme-300 font-sans text-sm font-semibold"
                  animate="fade"
                />
              </li>
            </ul>
          </div>
        </div>
        <div :class="layoutClasses.badgeClass">
          <CardSocials v-if="uc.socials" :card :class="layoutClasses.socials" :socials="uc.socials" />

          <div :class="layoutClasses.badgeWrap" class="text-theme-700 dark:text-theme-50 mt-5 text-right text-xs flex flex-col items-center gap-4  ">
            <template v-for="(badge, i) in uc.badges" :key="i">
              <a :href="card.link(badge.href)" :title="badge.name" class="inline-block">
                <ElImage :media="badge.media" :inline-image="true" />
              </a>
            </template>
          </div>
        </div>
      </div>

      <div class="mt-20">
        <div v-if="uc.starline" class="flex flex-col gap-2 mb-4 justify-center items-center">
          <div class="flex gap-1 justify-center items-center">
            <div v-for="(s) in 5" :key="s" class="">
              <div :class="highlightStar === s ? 'scale-150 dark:text-yellow-500 text-yellow-600' : 'dark:text-yellow-800/80 dark:hover:text-yellow-500 text-yellow-500'" class="text-xl i-tabler-star-filled hover:scale-125 transition-all" />
            </div>
          </div>

          <CardText
            class="text-xs font-sans text-theme-400 dark:text-theme-600"
            :card
            tag="div"
            path="starline"
            animate="rise"
          />
        </div>
        <div class="text-theme-300 dark:text-theme-600 my-6 text-center text-xs font-sans flex items-center justify-center">
          <span class="inline-flex gap-1">
            <span class="">&copy; {{ dayjs().format('YYYY') }}</span> <CardText :card tag="span" path="legal.copyrightText" />
          </span>
          <template v-if="uc.legal?.termsOfServiceUrl">
            <span class="opacity-70 mx-1 i-tabler-slash" />
            <a class="dark:hover:text-theme-100" :href="uc.legal?.termsOfServiceUrl">Terms of Service</a>
          </template>
          <template v-if="uc.legal?.privacyPolicyUrl">
            <span class="opacity-70 mx-1 i-tabler-slash" />
            <a class="dark:hover:text-theme-100" :href="uc.legal?.privacyPolicyUrl">Privacy Policy</a>
          </template>
        </div>
      </div>
      <div class="text-center">
        <a href="https://www.fiction.com" title="Powered by Fiction.com" class="text-theme-300/80 dark:text-theme-600/80 dark:hover:text-primary-400 hover:text-primary-500">
          <svg class="size-8 inline-block" preserveAspectRatio="xMidYMid meet" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z" fill="currentColor" /></svg>
        </a>
      </div>
    </div>
  </div>
</template>
