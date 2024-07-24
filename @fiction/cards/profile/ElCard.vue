<script setup lang="ts">
import { vue } from '@fiction/core'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { Card } from '@fiction/site'
import { useElementVisible } from '@fiction/ui/anim'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import CardText from '../CardText.vue'
import CardSocials from '../el/CardSocials.vue'
import NavDots from '../el/NavDots.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const mediaItems = vue.computed(() => {
  return uc.value.mediaItems?.filter(_ => _.media?.url)
})

const activeItem = vue.ref(0)
const isVisible = vue.ref(false)
vue.onMounted(async () => {
  await useElementVisible({ selector: `.minimal-profile`, onVisible: () => isVisible.value = true })
})
</script>

<template>
  <div class="minimal-profile">
    <div :class="card.classes.value.contentWidth">
      <div class="md:flex -mx-2 items-center" :class="uc.layout === 'left' ? 'md:flex-row-reverse' : ''">
        <div class="w-full md:w-[50%] px-2 ">
          <div class="relative">
            <EffectGlare wrap-class="rounded-[20px]">
              <div class="aspect-[5/7] relative w-full overflow-x-auto snap-mandatory snap-x flex no-scrollbar clip-path-anim" :class="isVisible ? '[clip-path:inset(0_round_20px)] opacity-100' : '[clip-path:inset(30%)] opacity-50'">
                <ElImage v-for="(item, i) in mediaItems" :key="i" :media="item.media" class="relative slide w-full h-full snap-center shrink-0" />
              </div>
            </EffectGlare>
            <NavDots v-model:active-item="activeItem" :items="mediaItems || []" :container-id="card.cardId" class="absolute bottom-4 z-20" />
          </div>
        </div>
        <div class="md:w-[50%] mt-6 md:mt-0 px-2 flex items-center">
          <div class="p-6 md:p-12 flex flex-col justify-center gap-10 2xl:gap-16 " :class="isVisible ? 'translate-y-0' : 'translate-y-[100px]'">
            <div class="details">
              <CardText
                tag="h3"
                :card="card"
                class="text-theme-300 dark:text-theme-600 mb-4 text-base lg:text-base font-sans font-medium"
                path="superHeading"
                animate="rise"
              />
              <CardText
                tag="h1"
                :card="card"
                class="heading text-4xl font-semibold md:text-4xl lg:text-5xl x-font-title tracking-tight lg:leading-[1.1] text-balance"
                path="heading"
                animate="rise"
              />
              <CardText
                tag="div"
                :card="card"
                class="sub-heading mt-6 text-xl font-medium prose dark:prose-invert text-balance"
                path="subHeading"
                :is-markdown="true"
                animate="rise"
              />
            </div>

            <div class="list">
              <CardText
                tag="h3"
                :card="card"
                class="sub-heading  text-theme-300 x-font-sans text-sm font-semibold mb-4"
                path="detailsTitle"
                placeholder="List Title"
              />
              <div class="flex gap-[10%] gap-y-4 flex-wrap font-sans text-sm font-medium">
                <div v-for="(item, i) in uc.details" :key="i" class="w-[45%] ">
                  <CardText
                    :card="card"
                    class="font-semibold"
                    :path="`details.${i}.name`"
                  />
                  <CardText
                    tag="a"
                    :card="card"
                    :class="item.href ? 'hover:text-primary-500 text-primary-600 dark:text-primary-400' : 'text-theme-500 dark:text-theme-400'"
                    :path="`details.${i}.desc`"
                    :href="item.href"
                  />
                </div>
              </div>
            </div>

            <CardSocials :card :socials="uc.socials || []" class="flex gap-2 text-2xl justify-center md:justify-start" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "@fiction/ui/entry.less";

.clip-path-anim{
  // '0.25,1,0.5,1'
  transition: clip-path 2s cubic-bezier(0.25, 1, 0.33, 1), opacity 2s cubic-bezier(0.25, 1, 0.33, 1), transform 2s cubic-bezier(0.25, 1, 0.33, 1);
}
</style>
