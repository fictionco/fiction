<script lang="ts" setup>
import FeedbackForm from '../@apps/site/src/figures/FeedbackForm.vue'
import FeedbackSiteChanel from './FeedbackSiteChanel.svg'
</script>

<template>
  <div class="relative" :style="{ perspective: `800px` }">
    <img
      class="shadow-lg max-w-2xl ring-black ring-opacity-10 ring-1 rounded-lg z-0 relative mx-auto"
      :src="FeedbackSiteChanel"
    >
    <div class="absolute -bottom-16 left-24 z-10" :style="{ transform: `` }">
      <div
        class="w-48 h-48 bg-white border-4 border-white shadow-lg max-w-2xl ring-black ring-opacity-10 ring-1 rounded-full flex flex-col overflow-hidden"
      >
        <div class="top grow relative">
          <div
            class="bg-black text-white font-bold text-xs w-[12em] text-center absolute bottom-0 p-2 rounded-tr-lg rounded-tl-lg left-1/2 transform -translate-x-1/2"
          >
            Give Your Feedback
          </div>
        </div>
        <div class="bottom h-16 bg-slate-200" />
      </div>
    </div>
    <div
      class="absolute -bottom-16 right-16 z-10"
      :style="{ transform: `rotateY(-4deg) rotateZ(0deg)` }"
    >
      <FeedbackForm class="w-64" />
    </div>
  </div>
</template>
