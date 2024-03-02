<script lang="ts" setup></script>

<template>
  <div
    class="nps md:text-color bg-primary-500 w-64 rounded-lg p-6 text-white shadow-lg ring-1 ring-black/5 md:bg-white"
  >
    <h3 class="text-sm font-extrabold md:text-theme-600">
      How likely are you to recommend us to a friend or colleague?
    </h3>
    <div class="numbers mt-3">
      <div
        v-for="num in 10"
        :key="num"
        class="mr-1 mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-center text-xs font-bold text-white transition-all hover:scale-105"
        :class="
          num === 9
            ? 'md:text-primary-500 md:border-primary-500 '
            : 'md:text-theme-300 md:border-slate-300 '
        "
      >
        <span>{{ num }}</span>
      </div>
    </div>
  </div>
</template>
