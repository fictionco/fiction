<script lang="ts" setup></script>

<template>
  <button
    class="cursor-pointer rounded-full bg-black/10 p-1 text-white opacity-80 shadow-md hover:bg-black/30 hover:opacity-100 focus:outline-none"
  >
    <span class="sr-only">Close panel</span>
    <!-- Heroicon name: x -->
    <svg
      class="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</template>
