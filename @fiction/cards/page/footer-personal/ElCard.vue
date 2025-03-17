<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import CardNavLink from '../../CardNavLink.vue'
import CardText from '../../CardText.vue'
import CardLink from '../../el/CardLink.vue'

defineOptions({ name: 'CardFooterPersonalV1' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)

vue.onMounted(() => {
  useElementVisible({
    caller: 'footerX',
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `#${props.card.cardId} .animate-item`,
        themeId: 'fade',
        config: { overallDelay: 150 },
      })
    },
  })
})
</script>

<template>
  <div :id="card.cardId">
    <div :class="card.classes.value.contentWidth">
      <div class="px-0 border-t border-theme-200 dark:border-theme-700/80 pt-16 mt-4 ">
        <!-- Main grid layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-24">
          <!-- Brand section -->
          <div class="w-full grow gap-6 space-y-4 pb-6">
            <CardLink
              v-if="uc.brand?.logo"
              :card
              :href="uc.brand?.href || '/'"
              class="flex items-end group"
            >
              <XLogoType
                :logo="uc.brand?.logo"
                :classes="{
                  text: 'x-font-title text-3xl font-medium',
                }"
                :media-handling="{ height: 3 }"
                class="transition-all group-hover:opacity-80 duration-200"
                data-test-id="footer-personal-nav-logo"
                :org="card.site?.org.value"
              />
            </CardLink>
            <CardText
              tag="p"
              :card
              path="brand.tagline"
              class="text-2xl text-theme-500 dark:text-theme-400 animate-item"
              animate="fade"
            />
          </div>

          <div class="w-full grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-12 flex-wrap">
            <div v-for="(menu, i) in uc.menus" :key="i">
              <CardText
                tag="h3"
                :card
                :path="`menus.${i}.title`"
                class="text-lg md:text-xl font-medium x-font-title mb-6 text-primary-500 dark:text-theme-500 animate-item"
                animate="fade"
              />
              <nav class="flex flex-col space-y-4 pl-1">
                <CardNavLink
                  v-for="(item, ii) in menu?.items"
                  :key="ii"
                  :card
                  :item="{
                    ...item,
                    basePath: `menus.${i}.items.${ii}`,
                  }"
                  class="truncate w-full animate-item text-lg md:text-xl hover:text-primary-600 dark:text-theme-200 dark:hover:text-primary-400 transition-colors"
                  animate="fade"
                />
              </nav>
            </div>
          </div>
        </div>

        <div class="border-t border-theme-200 dark:border-theme-700/50 pt-16 mt-16">
          <div class="flex justify-between gap-6 flex-col md:flex-row">
            <div>
              <div class="flex flex-wrap gap-x-8 gap-y-4 mb-8">
                <CardNavLink
                  v-for="(item, i) in uc.additional?.list1"
                  :key="i"
                  :card
                  :item="{
                    label: item.label,
                    href: item.href,
                    basePath: `additional.list1.${i}`,
                  }"
                  class="animate-item text-base lg:text-lg x-font-title text-theme-700 hover:text-primary-500 dark:text-theme-100 dark:hover:text-primary-400 transition-colors"
                  animate="fade"
                />
              </div>

              <div class=" flex flex-col sm:flex-row sm:justify-start gap-4 md:gap-8">
                <CardNavLink
                  v-for="(item, i) in uc.additional?.list2"
                  :key="i"
                  :card
                  :item="{
                    label: item.label,
                    href: item.href,
                    basePath: `additional.list2.${i}`,
                  }"
                  class="animate-item font-sans text-sm sm:text-base lg:text-lg text-theme-300 hover:text-primary-500 dark:text-theme-600 dark:hover:text-primary-400"
                  animate="fade"
                />
              </div>
            </div>
            <div>
              <div class="text-center">
                <a href="https://www.fiction.com" title="Powered by Fiction.com" class="text-theme-300/30 dark:text-theme-700/50 dark:hover:text-primary-400 hover:text-primary-500 transition-all">
                  <svg class="size-8 inline-block" preserveAspectRatio="xMidYMid meet" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z" fill="currentColor" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
