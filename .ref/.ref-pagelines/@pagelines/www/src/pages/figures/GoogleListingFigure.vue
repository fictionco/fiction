<script lang="ts" setup>
import GoogleShoppingVector from './GoogleShoppingVector.svg'
import GoogleListingVector from './GoogleListingVector.svg'
</script>

<template>
  <div class="relative" :style="{ perspective: `800px` }">
    <div
      class="relative z-0 max-w-2xl rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/10"
    >
      <img class="w-full" :src="GoogleShoppingVector">
    </div>
    <div
      class="absolute -bottom-12 right-0 z-10"
      :style="{ transform: `rotateY(-13deg) rotateZ(4deg)` }"
    >
      <div
        class="w-48 overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10"
      >
        <img class="w-full" :src="GoogleListingVector">
      </div>
    </div>
  </div>
</template>
