<script lang="ts" setup>
import NikeShot from './img/Shot.svg'
import FeedbackForm from './FeedbackForm.vue'
</script>

<template>
  <div
    class="nps perspective-1000"
    :style="{
      perspective: `1000px`,
    }"
  >
    <div
      class="floor aspect-[5/4] rounded-xl bg-cover shadow-lg"
      :style="{
        backgroundImage: `url(${NikeShot})`,
      }"
    />

    <div
      class="absolute bottom-8 right-4 inline-flex items-center rounded-md bg-black p-3 text-sm font-bold text-white shadow-lg"
    >
      <div class="ic mr-2 opacity-80">
        <svg
          class="w-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2392 848"
        >
          <path
            fill="currentColor"
            d="m342,0c0,0,-86,144,-86,275c0,140,103,217,233,217c146,0,242,-44,497,-111l1406,-371c0,0,-1192,517,-1762,753c-113,47,-219,85,-355,85c-150,0,-275,-90,-275,-240c0,-114,37,-199,99,-304c99,-168,243,-304,243,-304z"
          />
        </svg>
      </div>
      <span class="ml-1">Add Feedback</span>
    </div>
    <div class="app-adjust-left absolute -bottom-6 -left-12 w-56">
      <FeedbackForm />
    </div>
  </div>
</template>
