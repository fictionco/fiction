<script lang="ts" setup>
import { vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import screen from './img/screen.jpg'

defineProps({
  mode: {
    type: String,
    default: 'dark',
  },
})

const video = vue.ref('')
const items = [
  {
    title: 'Video Walkthrough',
    youtubeId: '_XFEtyo2tz4',
    img: screen,
    comingSoon: false,
  },
]

function setVideo(item: (typeof items)[number]) {
  if (item.comingSoon)
    return
  video.value = item.youtubeId
}
</script>

<template>
  <div class="p-4 md:p-0 md:text-left">
    <div class="font-brand mb-4 text-center italic">
      Watch the Videos ↘︎
    </div>
    <div
      class="video-thumbs w-full items-center justify-center space-y-4 md:inline-flex md:space-x-8 md:space-y-0"
      :class="mode === 'dark' ? 'video-thumbs-dark' : 'video-thumbs-light'"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="text-theme-400 transition-all"
        :class="
          item.comingSoon
            ? 'opacity-30 coming-soon cursor-not-allowed'
            : 'video-ready hover:scale-105 hover:text-theme-500 cursor-pointer '
        "
        @click.stop="setVideo(item)"
      >
        <img
          :src="item.img"
          class="inline-block w-[400px] rounded-xl shadow-lg ring-1 ring-black/10 hover:shadow-2xl"
        >
      </div>
      <ElModal
        :vis="!!video"
        modal-class="max-w-5xl m-4 bg-black"
        @update:vis="!$event ? (video = '') : ''"
      >
        <div class="relative h-0 bg-black pb-[56.5%]">
          <iframe
            class="absolute left-0 top-0 h-full w-full"
            :src="`https://www.youtube.com/embed/${video}?rel=0&modestbranding=1&showinfo=0`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </ElModal>
    </div>
  </div>
</template>

<style lang="less"></style>
