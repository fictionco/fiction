<script lang="ts" setup>
import ReviewRequestSms from '../@apps/site/src/figures/ReviewRequestSms.vue'
import VectorReviewWidget from './VectorReviewWidget.svg'
</script>

<template>
  <div class="relative" :style="{ perspective: `800px` }">
    <img
      class="shadow-lg max-w-2xl ring-black ring-opacity-10 ring-1 rounded-lg z-0 relative"
      :src="VectorReviewWidget"
    >
    <div
      class="absolute -bottom-16 right-16 z-10"
      :style="{ transform: `rotateY(-13deg) rotateZ(4deg)` }"
    >
      <ReviewRequestSms class="w-48" />
    </div>
  </div>
</template>
