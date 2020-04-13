<template>
  <section v-if="setting('home.intro')" class="home-hero pt-12 lg:pt-0">
    <div
      v-if="section1Figure"
      class="home-hero-img hidden lg:block bg-purple-900"
      :style="`background-image: url(${section1Figure});`"
    />
    <div v-else class="home-hero-img hidden lg:block bg-purple-900" />
    <div class="mx-auto px-4 py-8 md:px-16 md:py-12">
      <h1
        v-if="section1Title"
        v-formatted-text="section1Title"
        class="font-normal tracking-tight leading-tight text-3xl mt-2 text-purple-900 lg:text-5xl"
      />
      <div
        v-if="section1Content"
        v-formatted-text="section1Content"
        class="mt-2 text-lg text-gray-600 lg:text-xl"
      />
      <div v-if="section1Buttons" class="mt-4 md:mt-8">
        <template v-for="(button, index) in section1Buttons">
          <factor-link :key="index" :path="button.link" :class="button.classes">
            {{ button.text }}
            <factor-icon icon="fas fa-angle-right" />
          </factor-link>
        </template>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import { factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
  },
  data() {
    return {
      loading: true,
      section1Title: setting("home.intro.title"),
      section1Content: setting("home.intro.content"),
      section1Buttons: setting("home.intro.buttons"),
      section1Figure: setting("home.intro.figure"),
    }
  },
  methods: {
    setting,
  },
})
</script>
<style lang="less">
.home-hero {
  display: grid;
  grid-template-columns: 1fr minmax(750px, 1fr);
  grid-gap: 0;
  align-items: center;
  min-height: 450px;
  height: 85vh;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    min-height: 50vh;
    height: auto;
  }

  .home-hero-img {
    height: 100%;
    width: 100%;
    background-position: 0 0;
    background-size: cover;
  }
}
</style>
