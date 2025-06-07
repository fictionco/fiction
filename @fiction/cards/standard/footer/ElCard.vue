<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import { useService } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import CardWrap from '../../CardWrap.vue'
import CardLink from '../../el/CardLink.vue'

const { card } = defineProps<{ card: Card }>()
const { fictionEnv } = useService()

const icon = `<svg
            class="size-[.9em] inline-block mt-[-5px]"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z"
              fill="currentColor"
            />
          </svg>`
</script>

<template>
  <CardWrap :card class="border-t border-theme-700/50 text-theme-200 py-10">
    <div class="max-w-5xl mx-auto px-4 flex flex-col gap-8 justify-center items-center text-sm font-sans">
      <!-- Terms Above -->
      <nav class="flex justify-center md:justify-end gap-4 items-center">
        <span>&copy; {{ card.site?.org.value.name }}</span>
        &middot;
        <CardLink :card :href="fictionEnv.meta?.privacyUrl">
          Privacy
        </CardLink>
        &middot;
        <CardLink :card :href="fictionEnv.meta?.termsUrl">
          Terms
        </CardLink>
      </nav>

      <XButton
        href="https://www.fiction.com"
        size="md"
        design="outline"
        theme="primary"
        :icon="{ format: 'html', html: icon }"
      >
        Tell Your Story
      </XButton>
      <div class="flex gap-1 items-center font-sans text-theme-400">
        Powered by <CardLink
          :card
          class="text-sm font-medium underline underline-offset-4"
          href="https://www.fiction.com"
        >
          Fiction
        </CardLink>
      </div>
    </div>
  </CardWrap>
</template>
