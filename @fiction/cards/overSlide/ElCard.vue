<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig >>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)

const currentItemIndex = vue.ref(0)

const slideTime = 15000
const currentItem = vue.computed(() => uc.value.items?.[currentItemIndex.value])
let timer: NodeJS.Timeout | undefined = undefined
function autoSlideTimer() {
  const isActive = uc.value.autoSlide

  if (!isActive)
    return

  if (timer)
    clearTimeout(timer)

  timer = setTimeout(() => {
    const items = uc.value.items || []
    currentItemIndex.value = currentItemIndex.value + 1

    if (currentItemIndex.value >= items.length) {
      currentItemIndex.value = 0
    }

    autoSlideTimer()
  }, slideTime)
}

vue.onMounted(() => {
  autoSlideTimer()
})

function setActiveItem(index: number) {
  currentItemIndex.value = index

  autoSlideTimer()
}
</script>

<template>
  <div class="">
    <div class="y-4">
      <div class="flex items-center justify-between h-[65dvh] ">
        <div class="relative h-full basis-[30%]">
          <transition
            enter-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500"
            enter-from-class="opacity-0 translate-x-44"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-44"
            mode="out-in"
          >
            <div :key="currentItemIndex" class="text-theme-900 dark:text-theme-0 w-full absolute top-1/2 -translate-y-1/2 z-20 space-y-8" :class="currentItem?.textBlend === 'difference' ? 'mix-blend-difference text-white dark:text-black' : '[text-shadow:_1px_1px_2px_rgba(0,0,0,0.1)]'">
              <EffectFitText
                :lines="3"
                :content="currentItem?.title || ''"
                class="x-font-title z-20 font-bold w-[160%]"
              >
                <CardText :card tag="span" :path="`items.${currentItemIndex}.title`" />
              </EffectFitText>
              <EffectFitText
                v-if="currentItem?.subTitle"
                :lines="1"
                :content="currentItem?.subTitle || ''"
                class="x-font-title z-20 font-semibold w-[140%] mt-4"
              >
                <CardText animate="fade" :card tag="span" :path="`items.${currentItemIndex}.subTitle`" />
              </EffectFitText>
            </div>
          </transition>
        </div>
        <div class="relative h-full basis-[30%]">
          <transition
            enter-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500"
            enter-from-class="opacity-0 -translate-x-24"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500 delay-100"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-24"
            mode="out-in"
          >
            <ElImage :key="currentItemIndex" :media="currentItem?.media" class="absolute top-[10%] h-[80%] aspect-[3/4.5] md:aspect-[4.5/3] z-10 -ml-[40%] shadow-xl" />
          </transition>
        </div>
        <div class="relative h-full basis-[27%]">
          <transition
            enter-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500 delay-100"
            enter-from-class="opacity-0 translate-x-16"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500 "
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-16"
            mode="out-in"
          >
            <ElImage :key="currentItemIndex" :media="currentItem?.mediaBackground" class="transition-all absolute -right-[40%]  h-full w-[140%]" />
          </transition>
        </div>
      </div>
      <NavDots :active-item="currentItemIndex" :items="uc.items || []" :container-id="card.cardId" @update:active-item="setActiveItem($event)" />
    </div>
  </div>
</template>
