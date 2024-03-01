<script lang="ts" setup>
import screenErrors from './img/analyticsPerformanceErrors.webp'
</script>

<template>
  <div class="my-12">
    <div class="figure-stage relative m-auto max-w-screen-lg">
      <img
        class="rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenErrors"
        alt="Performance Debugging - Errors"
      >
    </div>
  </div>
</template>
