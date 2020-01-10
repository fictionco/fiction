<template>
  <section class="hero overflow-hidden bg-cover bg-center bg-purple-900 py-20">
    <div class="max-w-6xl mx-auto px-4">
      <div class="custom-uppercase text-purple-400">{{ subheadline }}</div>
      <h1 class="font-bold leading-tight text-3xl lg:text-4xl text-gray-100">{{ headline }}</h1>
      <div class="mt-2 text-base text-gray-600 lg:text-xl">
        <slot name="hero-content" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    headline: { type: String, default: "" },
    subheadline: { type: String, default: "" }
  }
})
</script>

<style lang="less">
.hero {
  background-image: url(../img/light-pattern.svg);
}
</style>
