<template>
  <div>
    <section class="bg-gray-100 bg-repeat-x" :style="introBackground">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col py-8 md:flex-row lg:py-12">
          <div class="flex flex-col justify-center p-8 md:w-1/2">
            <h3 class="custom-uppercase text-purple-500">{{ introPretitle }}</h3>
            <h1
              class="font-bold leading-tight text-3xl lg:text-4xl text-purple-900"
            >{{ introTitle }}</h1>
            <div v-formatted-text="introContent" class="mt-2 text-base lg:text-xl" />
          </div>
          <div class="relative p-8 md:w-1/2">
            <figure class="absolute top-0 right-0 z-20 mr-10 -mt-2">
              <img :src="introFigure" :alt="introPretitle" />
            </figure>
            <component
              :is="setting('contactForm.form')"
              class="mt-8 bg-white shadow-lg rounded-lg p-8"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      loading: true,
      introPretitle: setting("contact.intro.pretitle"),
      introTitle: setting("contact.intro.title"),
      introBackground: {
        backgroundImage: `url(${setting("contact.intro.backgroundImage")})`
      },
      introContent: setting("contact.intro.content"),
      introFigure: setting("contact.intro.figure")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("contact.meta.title"),
      description: setting("contact.meta.description"),
      image: setting("contact.meta.image")
    }
  }
})
</script>
