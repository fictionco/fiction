<template>
  <div :class="classes" class="relative">
    <h1
      class="font-bold text-3xl text-gray-200 py-1 relative z-10 lg:text-4xl"
      :style="backgroundImage"
    >{{ title }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    classes: { type: String, default: "" },
    image: { type: String, default: require("../img/squares.svg") }
  },
  data() {
    return {
      backgroundImage: `url(${require("../img/squares.svg")})`
    }
  }
}
</script>
