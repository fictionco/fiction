<script lang="ts" setup>
import type { MediaItem, vue } from '@factor/api'
import ElUi from '@factor/engine/ui/ElUi.vue'

export interface SectionProps {
  title?: string
  subTitle?: string
  features?: MediaItem[]
}

defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})
</script>

<template>
  <div class=" ">
    <div class="mx-auto max-w-6xl space-y-32 px-6 lg:px-8">
      <div
        v-for="(feat, i) in settings.features"
        :key="i"
        class="grid grid-cols-2 gap-24"
      >
        <div class="self-center">
          <h1
            class="ui-font-title text-4xl font-bold tracking-tighter lg:text-4xl"
            v-html="feat.name"
          />
          <p
            class="mt-6 text-xl lg:text-2xl lg:leading-snug"
            v-html="feat.desc"
          />
          <div class="mt-10 flex items-center gap-x-6">
            <ElUi
              v-for="(action, ii) in feat.actions"
              :key="ii"
              ui="button"
              btn="primary"
              :href="action.href"
            >
              {{ action.name }}
            </ElUi>
          </div>
        </div>
        <div class="">
          <div
            class="stage relative mx-auto max-w-lg"
            :style="{ perspective: `800px` }"
          >
            <template v-if="feat.media?.items">
              <div
                v-for="(item, ii) in feat.media.items"
                :key="ii"
                class="absolute z-10"
                :style="item.media?.style"
              >
                <img
                  class="z-0 mx-auto w-full scale-90 rounded-lg bg-white shadow-lg ring-1 ring-black/10 md:max-w-2xl md:scale-100"
                  :src="item.media?.url"
                >
              </div>
            </template>

            <img
              class="z-0 mx-auto w-full scale-90 rounded-lg bg-white shadow-lg ring-1 ring-black/10 md:max-w-2xl md:scale-100"
              :src="feat.media?.url"
              :style="feat.media?.style"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
