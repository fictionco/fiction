<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import CardNavLink from '../../CardNavLink.vue'
import CardText from '../../CardText.vue'
import CardWrap from '../../CardWrap.vue'
import CardButtons from '../../el/CardButtons.vue'

defineOptions({ name: 'FooterPro' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)

vue.onMounted(() => {
  useElementVisible({
    caller: 'footerPro',
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
  <CardWrap :card>
    <div :id="card.cardId">
      <div class="border-t border-theme-200 dark:border-theme-700/80 pt-16">
        <!-- Main grid layout -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <!-- Brand section -->
          <div class="xl:col-span-4 space-y-6">
            <div class="space-y-4">
              <XLogoType
                v-if="uc.brand?.logo"
                :logo="uc.brand?.logo"
                :classes="{
                  text: 'x-font-title text-3xl font-medium',
                }"
                :media-handling="{ height: 2 }"
                class="transition-all group-hover:opacity-80 duration-200"
                data-test-id="footer-pro-logo"
                :org="card.site?.org.value"
              />

              <CardText
                tag="p"
                :card
                path="brand.tagline"
                class="text-lg text-theme-600 dark:text-theme-400 animate-item font-sans"
                animate="fade"
              />
            </div>
            <CardButtons
              v-if="uc.brand?.action?.buttons"
              :buttons="uc.brand.action.buttons"
              :card
              base-path="brand.action"
              class="flex gap-4"
              animate="fade"
              design="solid"
            />
          </div>

          <!-- Navigation Columns -->
          <div class="xl:col-span-8">
            <div class="flex flex-wrap gap-x-16 gap-y-8 justify-start xl:justify-end">
              <div
                v-for="(column, i) in uc.menus"
                :key="i"
                class="grow-0 basis-44 animate-item"
              >
                <CardText
                  tag="h3"
                  :card
                  :path="`menus.${i}.title`"
                  class="text-lg font-sans text-theme-400 dark:text-theme-500 mb-4"
                  animate="fade"
                />
                <ul class="space-y-3">
                  <li v-for="(item, ii) in column.items" :key="ii">
                    <CardNavLink
                      :card
                      :item="{
                        ...item,
                        basePath: `menus.${i}.items.${ii}`,
                      }"
                      hover-effect="underline"
                      class="hover:underline md:text-lg font-sans transition-colors"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="mt-16 pt-8 border-t border-theme-200 dark:border-theme-800">
          <div class="flex flex-col gap-8 md:flex-row justify-between items-start">
            <CardButtons
              v-if="uc.badges?.buttons?.length"
              :card
              :buttons="uc.badges.buttons"
              base-path="badges"
              class="flex flex-wrap gap-4"
              design="ghost"
            />

            <!-- Social -->
            <div class="flex items-center gap-6">
              <a
                v-for="(social, i) in uc.additional?.social"
                :key="i"
                :href="social.href"
                :title="social.label"
                class="text-theme-400 hover:text-primary-500 dark:text-theme-600 dark:hover:text-primary-400 transition-colors animate-item"
              >
                <XIcon
                  v-if="social.media"
                  :media="social.media"
                  class="size-7"
                />
              </a>
            </div>
          </div>

          <!-- Links and Logo -->
          <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="flex flex-wrap gap-x-8 gap-y-4">
              <CardNavLink
                v-for="(item, i) in uc.additional?.links"
                :key="i"
                :card
                :item="{
                  ...item,
                  basePath: `additional.links.${i}`,
                }"
                class="text-sm text-theme-600 hover:text-primary-500 dark:text-theme-400 dark:hover:text-primary-400 font-sans transition-colors animate-item"
              />
            </div>

            <!-- Fiction Attribution -->
            <div class="text-center animate-item">
              <a
                href="https://www.fiction.com"
                title="Built with Fiction"
                class="dark:text-theme-600 dark:hover:text-primary-400 hover:text-primary-500 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-north-star h-8"
                ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h18" /><path d="M12 21v-18" /><path d="M7.5 7.5l9 9" /><path d="M7.5 16.5l9 -9" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CardWrap>
</template>
