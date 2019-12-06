<template>
  <section class="relative flex items-center text-center py-24 px-8 bg-purple-700">
    <figure class="absolute top-0 right-0 z-20 hidden mr-32 -mt-10 lg:block">
      <img :src="ctaFigure" :alt="ctaFigureAlt"/>
    </figure>
    <div class="max-w-xl mx-auto">
      <h1 class="font-bold text-3xl lg:text-4xl text-gray-100">{{ ctaTitle }}</h1>
      <div class="mt-4">
        <template v-for="(button, index) in ctaButtons">
          <factor-link :key="index" :path="button.link" :class="button.classes">
            {{ button.text }}
            <factor-icon icon="arrow-right ml-4" />
          </factor-link>
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/tools"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorIcon },
  data() {
    return {
      loading: true,
      ctaTitle: setting("site.cta.title"),
      ctaButtons: setting("site.cta.buttons"),
      ctaFigure: setting("site.cta.figure"),
      ctaFigureAlt: setting("site.cta.figureAlt")
    }
  },
  methods: { setting }
})
</script>
