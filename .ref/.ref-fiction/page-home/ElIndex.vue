<script setup lang="ts">
import EffectGrid from '@factor/ui/EffectGrid.vue'
import { useMeta } from '@factor/api'
import PressLogos from '@fiction/core/ui/PressLogos.vue'
import VideoThumbs from '@fiction/core/ui/VideoThumbs.vue'
import ElButton from '@factor/ui/ElButton.vue'
import PageWrap from '../el/PageWrap.vue'

const description = `Fiction helps you create custom AI generated avatars, images, and videos. Just upload your concept images.`
const title = `AI Generated Avatars and Photos`
useMeta({
  title,
  meta: [
    {
      name: `description`,
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
  ],
})
</script>

<template>
  <PageWrap class="px-4 md:px-8">
    <div class="relative overflow-hidden">
      <div class="z-50 mx-auto max-w-screen-xl p-4">
        <div class="relative z-10 flex min-h-[80vh] flex-col justify-center">
          <div class="max-w-6xl py-24">
            <div class="mb-6">
              <div
                class="text-primary-100 from-theme-300 to-theme-300 inline-block rounded-full bg-gradient-to-br px-3 py-1 text-xs font-medium md:px-6 md:text-base"
              >
                Start Building Your Generative AI Toolkit ↘︎
              </div>
            </div>
            <h1 class="text-3xl font-bold tracking-tight md:text-8xl">
              AI Generated Images
              <div
                class="bg-gradient-to-r from-blue-300 to-pink-400 bg-clip-text pb-2 text-transparent"
              >
                for Professionals
              </div>
            </h1>
            <div
              class="sub text-theme-300 my-8 text-lg font-normal md:text-3xl"
            >
              <span class="text-white"><span class="font-bold">
                                         Your personal, professional AI generated image toolkit. Train
                                         AI in seconds and generate avatars, photos and media.</span>
                <span class="text-theme-700 font-medium">
                  Just upload concept images to get started...</span>
              </span>
            </div>
            <div class="mt-12 space-y-4 md:flex md:space-x-8 md:space-y-0">
              <ElButton
                class="px-6 py-3 text-base font-semibold md:text-xl"
                btn="primary"
                size="lg"
                href="https://studio.fiction.com/register"
              >
                Create Your Account &rarr;
              </ElButton>
            </div>
          </div>
          <div class="space-y-12">
            <div class=" ">
              <VideoThumbs />
            </div>
            <div class="">
              <PressLogos />
            </div>
          </div>
        </div>
      </div>

      <EffectGrid alt-color="bg-pink-500" />
    </div>
  </PageWrap>
</template>

<style lang="less">
.slideIn-enter-from,
.slideOut-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.slideIn-enter-to,
.slideIn-leave-from,
.slideOut-enter-to,
.slideOut-leave-from {
  transform: translateX(0);
}
.slideIn-enter-active,
.slideIn-leave-active,
.slideOut-enter-active,
.slideOut-leave-active {
  transition: 0.2s ease;
  transition-property: opacity, transform;
}

.slideIn-leave-to,
.slideOut-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
