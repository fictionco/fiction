<script lang="ts" setup>
import { vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElBadge from './ElBadge.vue'
import birthday from './img/birthday.jpg'
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
    title: 'What Makes Us Human',
    youtubeId: 'CMzmXX4fgW4',
    img: birthday,
    comingSoon: true,
  },

  // {
  //   title: "Explore The Impossible",
  //   youtubeId: "_HvYXAF4Ea8",
  //   img: rocket,
  // },

  {
    title: 'Video Walkthrough',
    youtubeId: '_XFEtyo2tz4',
    img: screen,
    comingSoon: true,
  },
]

function setVideo(item: (typeof items)[number]) {
  if (item.comingSoon)
    return
  video.value = item.youtubeId
}
</script>

<template>
  <div class="p-4 text-center md:p-0 md:text-left">
    <div class="mb-4">
      <ElBadge>Watch the Videos ↘︎</ElBadge>
    </div>
    <div
      class="video-thumbs items-center space-y-4 md:inline-flex md:space-x-8 md:space-y-0"
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
          class="inline-block w-40 rounded-md shadow-lg hover:shadow-2xl"
        >
        <div
          class="rounded-b-md p-2 text-[10px] font-semibold leading-tight tracking-tight"
        >
          <div v-if="item.comingSoon">
            Coming Soon
          </div>
          <div v-else>
            {{ item.title }}
          </div>
        </div>
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
            title="Fiction"
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
