<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import XElement from '../CardElement.vue'

export type UserConfig = {
  title?: string
  subTitle?: string
  items?: MediaItem[]
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const overlayStyles = {
  left: { width: '30%', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
  rightRotate: { width: '30%', right: '-1rem', bottom: '-1rem', transform: 'rotateY(-11deg) rotateZ(3deg)' },
}
</script>

<template>
  <div class=" ">
    <div class="mx-auto max-w-6xl space-y-32 px-6 lg:px-8">
      <div
        v-for="(feat, i) in uc.items"
        :key="i"
        class="grid md:grid-cols-2 gap-4 md:gap-24"
      >
        <div class="self-center">
          <h1
            class="x-font-title text-4xl font-bold tracking-tighter lg:text-4xl"
            v-html="feat.name"
          />
          <p
            class="mt-6 text-xl lg:text-2xl lg:leading-snug"
            v-html="feat.desc"
          />
          <div class="mt-10 flex items-center gap-x-6">
            <XElement
              v-for="(action, ii) in feat.actions"
              :key="ii"
              theme-el="button"
              btn="primary"
              :href="action.href"
              :card="card"
            >
              {{ action.name }}
            </XElement>
          </div>
        </div>
        <div class="">
          <div
            class="stage relative mx-auto max-w-lg"
            :style="{ perspective: `800px` }"
          >
            <template v-if="feat.overlays">
              <div
                v-for="(item, ii) in feat.overlays"
                :key="ii"
                class="absolute z-10"
                :style="overlayStyles.rightRotate"
              >
                <img
                  class="z-0 mx-auto w-full scale-90 rounded-lg bg-theme-0 dark:bg-theme-1000 shadow-lg ring-1 ring-black/10 dark:ring-theme-500/50 md:max-w-2xl md:scale-100"
                  :src="item?.url"
                >
              </div>
            </template>

            <img
              class="z-0 mx-auto w-full scale-90 rounded-lg bg-theme-0 dark:bg-theme-1000 shadow-lg ring-1 ring-black/10 md:max-w-2xl md:scale-100"
              :src="feat.media?.url"
              :style="feat.media?.classes"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
