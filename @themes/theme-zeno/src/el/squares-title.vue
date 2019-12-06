<template>
  <div>
    <h1 class="inline-block relative font-bold text-3xl lg:text-4xl text-gray-200">
      <img
        :src="image"
        alt="squares"
        class="absolute max-h-full inset-y-auto right-auto -ml-10 z-0"
      />
      <span class="relative z-10">{{ title }}</span>
    </h1>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: { type: String, default: "" },
    image: { type: String, default: require("../img/squares.svg") }
  },
  data: function() {
    return {}
  }
}
</script>
