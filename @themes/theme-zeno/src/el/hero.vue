<template>
  <section class="hero overflow-hidden bg-cover bg-center bg-purple-900 py-16">
    <div class="px-8 mx-auto max-w-6xl">
      <div class="max-w-2xl custom-uppercase text-purple-400" :class="alignment">{{ subheadline }}</div>
      <h1
        class="max-w-2xl font-normal tracking-tight leading-tight text-3xl text-gray-100 lg:text-5xl"
        :class="alignment"
      >{{ headline }}</h1>
      <div class="max-w-2xl mt-2 text-base text-gray-500 lg:text-xl" :class="alignment">
        <slot name="hero-content" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    align: { type: String, default: "" },
    headline: { type: String, default: "" },
    subheadline: { type: String, default: "" }
  },
  computed: {
    alignment(this: any) {
      if (this.align == "center") {
        return "mx-auto"
      } else {
        return ""
      }
    }
  }
})
</script>

<style lang="less">
.hero {
  background-image: url(../img/light-pattern.svg);
}
</style>
