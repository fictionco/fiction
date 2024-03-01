<script lang="ts" setup>
import ReviewWidgetVector from './ReviewWidgetVector.svg'
import ReviewRequestEmail from './ReviewRequestEmail.vue'
</script>

<template>
  <div class="relative" :style="{ perspective: `800px` }">
    <div
      class="relative z-0 max-w-2xl rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/10"
    >
      <img class="w-full" :src="ReviewWidgetVector">
    </div>
    <div
      class="absolute -bottom-12 left-0 z-10"
      :style="{ transform: `rotateY(13deg) rotateZ(-4deg)` }"
    >
      <ReviewRequestEmail class="w-32" />
    </div>
  </div>
</template>
