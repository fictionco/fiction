<template>
  <div :class="classes">
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

<script>
export default {
  props: {
    classes: { type: String, default: "" },
    title: { type: String, default: "" },
    image: { type: String, default: require("../img/squares.svg") }
  },
  data() {
    return {
      backgroundImage: `url(${require("../img/squares.svg")})`
    }
  }
}
</script>
