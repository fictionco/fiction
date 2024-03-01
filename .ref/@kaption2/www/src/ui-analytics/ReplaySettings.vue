<script lang="ts" setup>
import screenshotReplay from './img/replaySettings.webp'
</script>

<template>
  <div class="my-12">
    <div class="figure-stage relative m-auto max-w-lg">
      <img
        class="variant-editor rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotReplay"
        alt="Session Replay - Videos"
      >
      <button
        type="button"
        class="absolute top-12 -right-16 inline-flex items-center rounded-md border border-transparent bg-green-50 px-6 py-3 text-lg font-medium text-green-600 shadow-lg ring-2 ring-green-200 ring-offset-2 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="-ml-1 mr-3 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
        Record On Conversion
      </button>
      <button
        type="button"
        class="absolute bottom-24 -left-16 inline-flex items-center rounded-md border border-transparent bg-red-50 px-6 py-3 text-lg font-medium text-red-600 shadow-lg ring-2 ring-red-200 ring-offset-2 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="-ml-1 mr-3 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Record On Error
      </button>
    </div>
  </div>
</template>
