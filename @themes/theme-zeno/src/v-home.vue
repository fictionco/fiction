<template>
  <div>
    <section class="home-hero pt-12 lg:pt-0">
      <div class="home-hero-img hidden lg:block bg-purple-900" />
      <div class="mx-auto px-4 py-8 md:px-16 md:py-12">
        <h1
          v-formatted-text="setting('home.intro.title')"
          class="font-normal tracking-tight leading-tight text-3xl mt-2 text-purple-900 lg:text-5xl"
        />
        <div
          v-formatted-text="setting('home.intro.content')"
          class="mt-2 text-lg text-gray-600 lg:text-xl"
        />
        <div class="mt-4 md:mt-8">
          <template v-for="(button, index) in setting('home.intro.buttons')">
            <factor-link :key="index" :path="button.link" :class="button.classes">
              {{ button.text }}
              <factor-icon icon="angle-right" />
            </factor-link>
          </template>
        </div>
      </div>
    </section>

    <section class="section-2 bg-gray-100 px-8 py-12">
      <div class="max-w-6xl mx-auto">
        <h1 class="custom-uppercase text-center text-purple-500">{{ setting("home.logos.title") }}</h1>
        <div class="flex flex-wrap items-center mt-8">
          <template v-for="(item, index) in setting('home.logos.list')">
            <factor-link
              :key="index"
              :path="item.link"
              :target="item.target"
              class="block w-full px-4 py-6 sm:w-1/3"
            >
              <img :src="item.image" :alt="item.alt" class="mx-auto" />
            </factor-link>
          </template>
        </div>
      </div>
    </section>

    <section
      :id="setting('home.section3.id')"
      class="section-3 relative bg-cover bg-center bg-purple-900 px-8 py-16"
    >
      <div
        class="relative z-20 max-w-6xl mx-auto flex flex-col bg-white rounded shadow-xl md:flex-row md:flex-wrap"
      >
        <div
          v-for="(item, index) in setting('home.section3.items')"
          :key="index"
          class="w-full even:bg-gray-100 md:w-1/3"
        >
          <div class="p-10">
            <img :src="item.icon" :alt="item.title" />
            <h2 class="font-normal tracking-tight text-3xl text-purple-900 mt-5">{{ item.title }}</h2>
            <div v-if="item.content" class="text-lg text-gray-600">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </section>

    <section :id="setting('home.section4.id')" class="section-4 bg-cover bg-center bg-white">
      <div class="max-w-6xl mx-auto flex flex-col py-8 md:flex-row lg:pt-12 lg:pb-24">
        <div class="flex flex-col p-8 justify-center md:w-3/5">
          <h3 class="custom-uppercase text-purple-500">{{ setting("home.section4.pretitle") }}</h3>
          <h1
            class="font-normal tracking-tight text-3xl lg:text-4xl text-purple-900"
          >{{ setting("home.section4.title") }}</h1>
          <div
            v-formatted-text="setting('home.section4.content')"
            class="mt-2 text-base leading-relaxed text-gray-600 lg:text-xl"
          />
          <div class="mt-8">
            <template v-for="(button, index) in setting('home.section4.buttons')">
              <factor-link :key="index" :path="button.link" :class="button.classes">
                {{ button.text }}
                <factor-icon icon="angle-right" />
              </factor-link>
            </template>
          </div>
        </div>
        <component :is="setting('home.section4.figure')" class="flex p-8 md:w-2/5" />
      </div>
    </section>

    <section
      :id="setting('home.section5.id')"
      class="section-5 overflow-hidden relative bg-gray-100"
    >
      <div class="max-w-6xl mx-auto px-8 pt-16 lg:pt-24 lg:pb-12">
        <div class="flex flex-col md:flex-row md:flex-wrap">
          <div class="pb-12 md:w-full">
            <h3
              class="custom-uppercase text-center text-purple-500"
            >{{ setting("home.section5.pretitle") }}</h3>
            <div class="flex items-center justify-center">
              <h1
                class="font-normal tracking-tight text-center text-3xl lg:text-4xl text-purple-900"
              >
                {{ setting("home.section5.title") }}
                <img
                  v-if="setting('home.section5.titleIcon')"
                  :src="setting('home.section5.titleIcon')"
                  :alt="setting('home.section5.title')"
                  class="inline-block lg:ml-2"
                />
              </h1>
            </div>
          </div>
          <div class="relative z-10 pb-8 md:pb-0 md:pr-8 md:w-3/5">
            <template v-for="(item, index) in setting('home.section5.items')">
              <div
                :key="index"
                class="mb-10 p-10 transition-all rounded bg-white custom-card-left md:mb-20"
              >
                <img v-if="item.image" :src="item.image" :alt="item.alt" />
                <div
                  v-formatted-text="item.content"
                  class="text-base mt-4 leading-relaxed text-gray-600 lg:text-xl"
                />
              </div>
            </template>
          </div>
          <div
            class="relative z-0 max-h-full w-full top-auto right-0 bottom-0 left-auto md:pt-24 md:absolute md:w-1/2"
          >
            <component
              :is="setting('home.section5.syntax')"
              :title="setting('home.section5.syntaxTitle')"
              class="md:pt-24"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="section-6">
      <div class="max-w-6xl mx-auto px-8 py-16 lg:py-24">
        <div class="max-w-xs mx-auto">
          <h3
            class="custom-uppercase text-center text-purple-500"
          >{{ setting("home.testimonials.pretitle") }}</h3>
          <h1
            class="mt-2 text-normal tracking-tight leading-tight text-3xl text-center text-purple-900 lg:text-4xl"
          >{{ setting("home.testimonials.title") }}</h1>
        </div>
        <div class="flex flex-col text-base mt-6 md:flex-row md:flex-wrap lg:text-xl">
          <template v-for="(item, index) in setting('home.testimonials.items')">
            <div :key="index" class="w-full p-8 md:w-1/2">
              <blockquote class="relative inline-block">
                <span class="absolute text-6xl text-purple-600 font-serif -ml-10 -mt-6">&ldquo;</span>
                <span v-formatted-text="item.content" class="leading-relaxed text-gray-600" />
              </blockquote>
              <footer class="flex items-center mt-6">
                <img
                  :src="item.image"
                  :alt="item.author + ' - ' + item.info"
                  class="rounded-full h-10 w-10 ml-auto shadow-lg md:h-16 md:w-16"
                />
                <div class="ml-4 text-base">
                  <cite class="block">{{ item.author }}</cite>
                  <cite class="block">{{ item.info }}</cite>
                </div>
              </footer>
            </div>
          </template>
        </div>
      </div>
    </section>

    <site-cta />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import { factorBtn, factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorBtn,
    factorLink,
    factorIcon,
    "site-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description"),
      image: setting("home.meta.image")
    }
  }
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
    background-image: url(./img/intro.svg);
    background-position: 0 0;
    background-size: cover;
  }
}
.section-3 {
  &:after {
    position: absolute;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    display: block;
    width: 100%;
    height: 30%;
    background: #fff;
  }
}
.section-3 {
  background-image: url(./img/light-pattern.svg);
}
.section-4 {
  background-image: url(./img/lighter-pattern.svg);
}
</style>