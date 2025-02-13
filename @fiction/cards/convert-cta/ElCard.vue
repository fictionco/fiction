<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { pathCheck, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import SuperTitle from '../el/SuperTitle.vue'
import { schema } from './config'

defineOptions({ name: 'CardCtaV1' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)

vue.onMounted(() => {
  useElementVisible({
    caller: 'ctaAlpha',
    selector: `[data-card-id="${props.card.cardId}"]`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `[data-card-id="${props.card.cardId}"] .animate-item`,
        themeId: 'fade',
        config: { overallDelay: 150 },
      })
    },
  })
})

const colPad = 'p-4 md:p-12 xl:p-16'

const hasBenefits = vue.computed(() => {
  return uc.value.benefits?.items?.length
})
</script>

<template>
  <div :id="card.cardId" class="relative">
    <div :class="card.classes.value.contentWidth">
      <div class="overflow-hidden bg-theme-50/50 dark:bg-theme-800/20 rounded-xl border border-theme-200 dark:border-theme-800/70">
        <div
          class="flex flex-col lg:flex-row  "
          :class="hasBenefits ? 'divide-x divide-theme-200 dark:divide-theme-800/70 lg:justify-between' : ' justify-center'"
        >
          <div class="gap-8 xl:gap-8 flex flex-col justify-center grow max-w-screen-md" :class="colPad">
            <div class="space-y-4 xl:space-y-6">
              <SuperTitle
                v-if="uc.superTitle"
                :card
                :base-path="pathCheck('superTitle', schema)"
                :super-title="uc.superTitle"
              />

              <CardText
                tag="h2"
                :card
                :path="pathCheck('title', schema)"
                class="font-semibold x-font-title text-2xl lg:text-3xl animate-item text-balance"
                animate="fade"
              />

              <CardText
                v-if="uc.subTitle"
                tag="p"
                :card
                :path="pathCheck('subTitle', schema)"
                class="text-pretty text-xl text-theme-600 dark:text-theme-400 max-w-2xl animate-item leading-relaxed"
                animate="fade"
              />
            </div>

            <CardActionArea
              :card
              :classes="{ buttons: 'flex gap-4' }"
              :base-path="pathCheck('action', schema)"
              size="xl"
            />
          </div>

          <!-- Benefits Grid -->
          <div v-if="hasBenefits" class="flex flex-col gap-6 lg:gap-8 justify-center lg:col-span-5 bg-theme-50/50 dark:bg-theme-900" :class="colPad">
            <div class="relative space-y-6">
              <div v-if="uc.benefits?.title" class="x-font-highlight  flex items-center gap-3 md:-ml-4">
                <div>
                  <CardText :card :path="pathCheck('benefits.title', schema)" class="text-theme-400 dark:text-theme-500 text-lg md:text-2xl x-font-highlight" />
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 71.75 106.25"
                    enable-background="new 0 0 71.75 85"
                    xml:space="preserve"
                    class="size-6 lg:size-8 text-theme-400/70 dark:text-theme-500/70 -rotate-90 translate-y-2"
                  ><path fill="currentColor" d="M1.949,75.078l20.806,9.611c1.684,0.777,3.678,0.043,4.455-1.64c0.776-1.684,0.043-3.677-1.64-4.455v0.001l-13.874-6.41  c19.145-4.849,32.377-12.89,41.376-21.896C63.655,39.71,68.319,27.918,70.306,18.825c1.99-9.106,1.352-15.558,1.33-15.806  c-0.188-1.844-1.834-3.188-3.678-3.002c-0.801,0.081-1.507,0.438-2.034,0.965c-0.688,0.688-1.073,1.67-0.968,2.713l0.001,0.001  c0,0,0,0,0.001,0.022c0.045,0.479,0.495,6.402-1.384,14.442c-1.884,8.05-6.048,18.178-15.249,27.381  c-8.112,8.105-20.193,15.574-38.43,20.174l6.188-13.689c0.764-1.689,0.014-3.679-1.676-4.442c-1.31-0.591-2.799-0.273-3.758,0.687  c-0.278,0.278-0.512,0.61-0.685,0.991L0.298,70.649C-0.46,72.329,0.277,74.306,1.949,75.078z" /></svg>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(benefit, i) in uc.benefits?.items"
                  :key="i"
                  class="flex gap-4 animate-item max-w-sm items-center justify-start w-full"
                >
                  <XIcon v-if="benefit.icon" :media="benefit.icon" class="size-8 lg:size-10 text-primary-400/70 dark:text-primary-500" />
                  <div class="grow w-full space-y-2">
                    <CardText
                      tag="h3"
                      :card
                      :path="pathCheck(`benefits.items.${i}.label`)"
                      class="font-semibold text-lg lg:text-xl x-font-title"
                    />
                    <CardText
                      tag="p"
                      :card
                      :path="pathCheck(`benefits.items.${i}.description`)"
                      class="font-medium text-xs lg:text-sm line-clamp-2 text-theme-500 x-font-title"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
